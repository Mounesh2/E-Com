

export default function AboutPage() {
    return (
        <div className="page-container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800' }}>About Trendify</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginTop: '5px' }}>
                    Your trusted e-commerce partner
                </p>
            </div>

            {/* About Banner */}
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '350px', marginBottom: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
                <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Our Team" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2))',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5%', color: 'white'
                }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Building the Future of E-commerce</h3>
                    <p style={{ fontSize: '1.1rem', marginTop: '8px', opacity: 0.9 }}>Connecting customers with quality products worldwide</p>
                </div>
            </div>

            {/* Grid for core details */}
            <div className="glass-panel" style={{ padding: '40px', marginBottom: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', maxWidth: '900px', margin: '0 auto' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>🛍️ Our Story</h2>
                        <p style={{ color: '#4a5568', lineHeight: 1.6 }}>
                            Founded in 2024, Trendify has been dedicated to providing customers with the best online shopping experience. 
                            We believe in quality products, competitive prices, and exceptional customer service.
                        </p>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px' }}>🎯 Our Mission</h2>
                        <p style={{ color: '#4a5568', lineHeight: 1.6 }}>
                            To make online shopping accessible, enjoyable, and trustworthy for everyone. We curate the finest products 
                            across electronics, clothing, and books to meet all your needs.
                        </p>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', textAlign: 'center' }}>⭐ Why Choose Us</h2>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                            gap: '20px' 
                        }}>
                            <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}>
                                <span style={{ fontSize: '2rem' }}>🚚</span>
                                <h4 style={{ margin: '8px 0 4px', fontWeight: '700' }}>Fast Delivery</h4>
                                <p style={{ fontSize: '0.85rem', color: '#718096' }}>Quick and reliable shipping</p>
                            </div>
                            
                            <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}>
                                <span style={{ fontSize: '2rem' }}>🔒</span>
                                <h4 style={{ margin: '8px 0 4px', fontWeight: '700' }}>Secure Shopping</h4>
                                <p style={{ fontSize: '0.85rem', color: '#718096' }}>Your data is always protected</p>
                            </div>
                            
                            <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}>
                                <span style={{ fontSize: '2rem' }}>💎</span>
                                <h4 style={{ margin: '8px 0 4px', fontWeight: '700' }}>Quality Products</h4>
                                <p style={{ fontSize: '0.85rem', color: '#718096' }}>Only the best for our customers</p>
                            </div>
                            
                            <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(255,255,255,0.4)', borderRadius: '8px' }}>
                                <span style={{ fontSize: '2rem' }}>🎧</span>
                                <h4 style={{ margin: '8px 0 4px', fontWeight: '700' }}>24/7 Support</h4>
                                <p style={{ fontSize: '0.85rem', color: '#718096' }}>We're here when you need us</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
