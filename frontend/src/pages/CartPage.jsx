import { useState } from 'react';

// Helper to generate mock payment IDs outside of rendering flow
const generateMockPaymentId = () => {
    return `pay_mock_${Math.random().toString(36).substring(2, 11)}`;
};

export default function CartPage({ cart, onRemoveItem, token, onCheckoutSuccess }) {
    const [checkingOut, setCheckingOut] = useState(false);
    
    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    const handleApplyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        if (code === 'MYNTRA50' || code === 'WELCOME10') {
            setAppliedCoupon(code);
            setCouponSuccess(`Coupon "${code}" applied successfully!`);
            setCouponError('');
        } else {
            setCouponError('Invalid coupon code. Try MYNTRA50 or WELCOME10');
            setCouponSuccess('');
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon('');
        setCouponCode('');
        setCouponSuccess('');
        setCouponError('');
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setCheckingOut(true);

        try {
            const response = await fetch('http://localhost:8000/api/checkout/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ coupon: appliedCoupon })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to initialize payment');
            }

            const orderDetails = await response.json();
            const loaded = await loadRazorpayScript();
            
            if (!loaded) {
                const confirmMock = window.confirm(
                    "Razorpay SDK could not be loaded. Would you like to simulate a successful checkout in development mode?"
                );
                if (confirmMock) {
                    await simulatePaymentVerification(orderDetails.orderId, generateMockPaymentId());
                }
                setCheckingOut(false);
                return;
            }

            const options = {
                key: orderDetails.keyId,
                amount: orderDetails.amount,
                currency: orderDetails.currency,
                name: '🛍️ Trendify',
                description: 'Complete E-Commerce Purchase',
                order_id: orderDetails.orderId,
                handler: async function (paymentRes) {
                    await verifyPayment(paymentRes);
                },
                prefill: {
                    name: orderDetails.user.fullName,
                    email: orderDetails.user.email,
                    contact: orderDetails.user.phone
                },
                theme: {
                    color: '#ff3f6c'
                },
                modal: {
                    ondismiss: function () {
                        setCheckingOut(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            
            if (orderDetails.orderId.startsWith('order_mock_')) {
                const confirmMock = window.confirm(
                    "You are using sandbox credentials. Would you like to simulate a successful payment?"
                );
                if (confirmMock) {
                    await simulatePaymentVerification(orderDetails.orderId, generateMockPaymentId());
                } else {
                    setCheckingOut(false);
                }
            } else {
                rzp.open();
            }

        } catch (error) {
            alert(error.message || 'Payment initialization error');
            setCheckingOut(false);
        }
    };

    const verifyPayment = async (paymentRes) => {
        try {
            const res = await fetch('http://localhost:8000/api/checkout/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    razorpay_order_id: paymentRes.razorpay_order_id,
                    razorpay_payment_id: paymentRes.razorpay_payment_id,
                    razorpay_signature: paymentRes.razorpay_signature
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Payment verified successfully! Thank you for your purchase.');
                onCheckoutSuccess();
            } else {
                alert(data.error || 'Payment signature verification failed');
            }
        } catch (error) {
            console.error('Verification network error:', error);
            alert('Verification network error');
        } finally {
            setCheckingOut(false);
        }
    };

    const simulatePaymentVerification = async (orderId, paymentId) => {
        try {
            const res = await fetch('http://localhost:8000/api/checkout/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    razorpay_order_id: orderId,
                    razorpay_payment_id: paymentId,
                    razorpay_signature: 'mock_signature_verified'
                })
            });

            if (res.ok) {
                alert('Mock payment verified successfully! Order completed.');
                onCheckoutSuccess();
            } else {
                alert('Simulation verification failed');
            }
        } catch (error) {
            console.error('Simulation connection error:', error);
            alert('Simulation connection error');
        } finally {
            setCheckingOut(false);
        }
    };

    // Calculate totals
    const totalMRP = cart.reduce((sum, item) => {
        const original = item.originalPrice || item.price;
        return sum + original * item.quantity;
    }, 0);

    const totalActualBeforeDiscount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountOnMRP = totalMRP - totalActualBeforeDiscount;

    let couponDiscount = 0;
    if (appliedCoupon === 'MYNTRA50') {
        couponDiscount = totalActualBeforeDiscount * 0.50;
    } else if (appliedCoupon === 'WELCOME10') {
        couponDiscount = totalActualBeforeDiscount * 0.10;
    }

    const totalActual = totalActualBeforeDiscount - couponDiscount;

    return (
        <div className="page-container" style={{ margin: '20px auto' }}>
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid #eaeaec', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Shopping Bag ({cart.length} Items)
                </h2>
            </div>

            {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#535766' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>There is nothing in your bag. Let's add some items!</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        style={{
                            padding: '12px 24px', background: '#ff3f6c', color: 'white',
                            border: 'none', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer'
                        }}
                    >
                        Go Shop
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    {/* Items column */}
                    <div className="cart-items-list">
                        <div style={{ padding: '12px', border: '1px solid #eaeaec', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700' }}>
                            <span>🚚</span>
                            <span>Yay! <strong>Free Delivery</strong> on this order</span>
                        </div>

                        {cart.map((item) => {
                            const nameParts = item.name.split(' ');
                            const brand = nameParts[0];
                            const subtitle = nameParts.slice(1).join(' ') || item.name;

                            return (
                                <div key={item.id} className="cart-item-card">
                                    <img src={item.image} alt={item.name} className="cart-item-thumb" />
                                    
                                    <div className="cart-item-details">
                                        <h4>{brand}</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#282c3f' }}>{subtitle}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#7e818c', margin: '6px 0 10px' }}>
                                            Size: <strong>M</strong> &nbsp;|&nbsp; Qty: <strong>{item.quantity}</strong>
                                        </p>
                                        
                                        <div className="item-card-price-row">
                                            <span className="price-current">₹{item.price}</span>
                                            {item.originalPrice && (
                                                <>
                                                    <span className="price-original">₹{item.originalPrice}</span>
                                                    <span className="price-discount-percent">({item.discount}% OFF)</span>
                                                </>
                                            )}
                                        </div>

                                        <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#535766', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span>↩️</span>
                                            <span><strong>14 days</strong> return available</span>
                                        </div>
                                    </div>

                                    <button 
                                        className="cart-item-remove-btn" 
                                        onClick={() => onRemoveItem(item.id)}
                                        disabled={checkingOut}
                                        title="Remove item"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bill breakdown column */}
                    <div>
                        {/* Coupon Section */}
                        <div className="cart-coupon-box">
                            <div className="cart-coupon-title">Apply Coupon</div>
                            {appliedCoupon ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#03a685' }}>
                                        ✓ Coupon "{appliedCoupon}" Applied
                                    </span>
                                    <button 
                                        onClick={handleRemoveCoupon}
                                        style={{ background: 'none', border: 'none', color: '#ff3f6c', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="cart-coupon-input-row">
                                        <input 
                                            type="text" 
                                            className="cart-coupon-input" 
                                            placeholder="Enter coupon (MYNTRA50, WELCOME10)" 
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                        />
                                        <button className="cart-coupon-btn" onClick={handleApplyCoupon}>Apply</button>
                                    </div>
                                    {couponError && <div className="cart-coupon-msg" style={{ color: '#ff3f6c' }}>{couponError}</div>}
                                    {couponSuccess && <div className="cart-coupon-msg" style={{ color: '#03a685' }}>{couponSuccess}</div>}
                                </>
                            )}
                        </div>

                        <div className="cart-summary-card">
                            <h3>Price Details ({cart.length} Items)</h3>
                            
                            <div className="cart-summary-row">
                                <span>Total MRP</span>
                                <span>₹{totalMRP.toFixed(2)}</span>
                            </div>
                            
                            <div className="cart-summary-row">
                                <span>Discount on MRP</span>
                                <span style={{ color: '#03a685' }}>-₹{discountOnMRP.toFixed(2)}</span>
                            </div>

                            {couponDiscount > 0 && (
                                <div className="cart-summary-row">
                                    <span>Coupon Discount ({appliedCoupon})</span>
                                    <span style={{ color: '#03a685' }}>-₹{couponDiscount.toFixed(2)}</span>
                                </div>
                            )}
                            
                            <div className="cart-summary-row">
                                <span>Convenience Fee</span>
                                <span style={{ color: '#03a685', fontWeight: '700' }}>FREE</span>
                            </div>

                            <div className="cart-summary-total">
                                <span>Total Amount</span>
                                <span>₹{totalActual.toFixed(2)}</span>
                            </div>

                            <button 
                                className="checkout-btn" 
                                onClick={handleCheckout}
                                disabled={checkingOut}
                            >
                                {checkingOut ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
