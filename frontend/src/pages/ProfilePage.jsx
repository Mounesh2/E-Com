import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function ProfilePage({ token, onBack }) {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileAndOrders = async () => {
            try {
                // Fetch profile details
                const profileRes = await fetch(`${API_BASE_URL}/api/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                // Fetch recent orders
                const ordersRes = await fetch(`${API_BASE_URL}/api/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfileAndOrders();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="page-container" style={{ textAlign: 'center', color: 'white', padding: '100px 0' }}>
                <h2>Loading Profile Details...</h2>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="page-container" style={{ textAlign: 'center', color: 'white', padding: '100px 0' }}>
                <h2>Failed to load user profile.</h2>
                <button className="back-btn" onClick={onBack}>← Back Home</button>
            </div>
        );
    }

    return (
        <div className="page-container">
            <button className="back-btn" onClick={onBack}>← Back</button>

            <div className="profile-card glass-panel">
                <div className="profile-header-section">
                    <div className="profile-avatar-circle">👤</div>
                    <div className="profile-meta">
                        <h2>{profile.fullName}</h2>
                        <p>{profile.email}</p>
                    </div>
                </div>

                <div className="profile-info-grid">
                    <div className="profile-info-item">
                        <div className="profile-info-label">📞 Phone</div>
                        <div className="profile-info-value">{profile.phone}</div>
                    </div>
                    <div className="profile-info-item">
                        <div className="profile-info-label">📍 Address</div>
                        <div className="profile-info-value">{profile.address}</div>
                    </div>
                    <div className="profile-info-item">
                        <div className="profile-info-label">📅 Member Since</div>
                        <div className="profile-info-value">{profile.memberSince}</div>
                    </div>
                </div>

                <div className="orders-section">
                    <h3>📦 Recent Orders</h3>
                    {orders.length === 0 ? (
                        <p style={{ color: '#4a5568', fontStyle: 'italic' }}>No orders placed yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {orders.map((order) => (
                                <div key={order.id} className="order-item-row" style={{ display: 'block' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                                            ID: #{order.order_id.replace('order_mock_', 'MOCK-')}
                                        </span>
                                        <span className={`order-status ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    
                                    <div style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '8px' }}>
                                        {order.items.map((item, index) => (
                                            <span key={index}>
                                                {item.name} (x{item.quantity})
                                                {index < order.items.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#718096' }}>
                                        <span>Total: <strong>₹{order.total_amount.toFixed(2)}</strong></span>
                                        <span>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
