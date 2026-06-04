import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import ItemCard from '../components/ItemCard';

export default function ProductDetailPage({ itemId, onAddToCart, onShowDetail, onBack, onAddToWishlist }) {
    const [item, setItem] = useState(null);
    const [selectedSize, setSelectedSize] = useState('M');
    const [relatedItems, setRelatedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pinCode, setPinCode] = useState('');
    const [pinStatus, setPinStatus] = useState('');

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/items/${itemId}`);
                const data = await response.json();
                setItem(data);

                const allResponse = await fetch(`${API_BASE_URL}/api/items`);
                const allItems = await allResponse.json();
                const related = allItems
                    .filter(i => i.category === data.category && i.id !== data.id)
                    .slice(0, 4);
                setRelatedItems(related);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) {
            fetchProductDetail();
        }
    }, [itemId]);

    const handlePinCheck = (e) => {
        e.preventDefault();
        if (/^\d{6}$/.test(pinCode)) {
            setPinStatus('✔️ Delivery available by tomorrow!');
        } else {
            setPinStatus('❌ Invalid Pin Code. Please enter 6 digits.');
        }
    };

    if (loading) {
        return (
            <div className="page-container" style={{ textAlign: 'center', color: '#282c3f', padding: '100px 0' }}>
                <h2>Loading Product Details...</h2>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="page-container" style={{ textAlign: 'center', padding: '100px 0' }}>
                <h2>Product not found.</h2>
                <button className="back-btn" onClick={onBack}>← Back to Catalog</button>
            </div>
        );
    }

    const nameParts = item.name.split(' ');
    const brand = nameParts[0];
    const subtitle = nameParts.slice(1).join(' ') || item.name;

    // Build lists of images for double column
    const allImages = [item.image, ...(item.images || [])].slice(0, 4);

    return (
        <div className="page-container">
            <button className="back-btn" onClick={onBack}>← Back to Products</button>

            <div className="detail-layout">
                {/* Images grid (Myntra fashion style) */}
                <div className="detail-images-grid">
                    {allImages.map((img, idx) => (
                        <img 
                            key={idx} 
                            src={img} 
                            alt={`${item.name} image ${idx + 1}`} 
                            className="detail-grid-img"
                        />
                    ))}
                </div>

                {/* Info and action panel */}
                <div className="detail-info">
                    <h1 className="detail-brand-name">{brand}</h1>
                    <h2 className="detail-title">{subtitle}</h2>
                    
                    <div className="detail-price-row">
                        <span className="detail-price-current">₹{item.price}</span>
                        {item.originalPrice && (
                            <>
                                <span className="detail-price-original">₹{item.originalPrice}</span>
                                <span className="detail-price-discount">({item.discount}% OFF)</span>
                            </>
                        )}
                    </div>

                    <div style={{ color: '#03a685', fontWeight: '700', fontSize: '0.9rem', marginBottom: '24px' }}>
                        inclusive of all taxes
                    </div>

                    {/* Size selectors */}
                    <div className="detail-size-section">
                        <h4 className="detail-size-title">Select Size</h4>
                        <div className="detail-size-options">
                            {['S', 'M', 'L', 'XL'].map(sz => (
                                <div 
                                    key={sz} 
                                    className={`size-tile ${selectedSize === sz ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(sz)}
                                >
                                    {sz}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="detail-actions">
                        <button 
                            className="detail-action-btn-bag"
                            onClick={() => onAddToCart(item.id, selectedSize)}
                        >
                            👜 Add to Bag
                        </button>
                        
                        <button 
                            className="detail-action-btn-wish"
                            onClick={() => onAddToWishlist(item.id)}
                        >
                            🤍 Wishlist
                        </button>
                    </div>

                    {/* Delivery check */}
                    <div style={{ padding: '20px 0', borderBottom: '1px solid #eaeaec', marginBottom: '24px' }}>
                        <h4 className="detail-size-title">Delivery Options</h4>
                        <form onSubmit={handlePinCheck} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <input 
                                type="text"
                                placeholder="Enter Pin Code"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}
                                style={{ padding: '8px 12px', border: '1px solid #d4d5d9', outline: 'none', borderRadius: '4px' }}
                            />
                            <button 
                                type="submit"
                                style={{
                                    padding: '8px 16px', background: 'none', border: '1px solid #ff3f6c',
                                    color: '#ff3f6c', fontWeight: '700', borderRadius: '4px', cursor: 'pointer'
                                }}
                            >
                                Check
                            </button>
                        </form>
                        {pinStatus && (
                            <div style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: '600', color: pinStatus.includes('✔️') ? '#03a685' : '#c53030' }}>
                                {pinStatus}
                            </div>
                        )}
                    </div>

                    {/* Description specs list */}
                    <div>
                        <h4 className="detail-size-title" style={{ marginBottom: '10px' }}>Product Description</h4>
                        <p style={{ color: '#535766', fontSize: '0.95rem', lineHeight: '1.6' }}>
                            {item.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Related products */}
            {relatedItems.length > 0 && (
                <div className="related-section">
                    <h3 className="section-title">Customers Also Liked</h3>
                    <div className="home-items-grid">
                        {relatedItems.map(rel => (
                            <ItemCard 
                                key={rel.id} 
                                item={rel} 
                                onAddToCart={onAddToCart} 
                                onShowDetail={onShowDetail} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
