

export default function WishlistPage({ wishlist, onRemoveFromWishlist, onMoveToBag }) {
    return (
        <div className="page-container">
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid #eaeaec', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    My Wishlist ({wishlist.length} Items)
                </h2>
            </div>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#535766' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Your Wishlist is empty.</p>
                    <p style={{ fontSize: '0.95rem', color: '#7e818c' }}>Save your favorite items here to buy them later!</p>
                </div>
            ) : (
                <div className="home-items-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                    {wishlist.map((item) => {
                        const nameParts = item.name.split(' ');
                        const brand = nameParts[0];
                        const subtitle = nameParts.slice(1).join(' ') || item.name;

                        return (
                            <div 
                                key={item.id} 
                                className="item-card" 
                                style={{ border: '1px solid #eaeaec', position: 'relative' }}
                            >
                                {/* Remove from wishlist cross icon */}
                                <button 
                                    onClick={() => onRemoveFromWishlist(item.id)}
                                    style={{
                                        position: 'absolute', top: '10px', right: '10px',
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #eaeaec',
                                        fontSize: '0.8rem', cursor: 'pointer', zIndex: '10',
                                        display: 'flex', alignItems: 'center', justify: 'center',
                                        color: '#7e818c'
                                    }}
                                    title="Delete item"
                                >
                                    ✕
                                </button>

                                <div className="item-image-wrapper" style={{ height: '240px' }}>
                                    <img src={item.image} alt={item.name} className="item-card-image" />
                                </div>

                                <div className="item-card-content" style={{ padding: '12px' }}>
                                    <div className="item-card-brand">{brand}</div>
                                    <h3 style={{ fontSize: '0.8rem', marginBottom: '8px' }}>{subtitle}</h3>
                                    
                                    <div className="item-card-price-row" style={{ marginBottom: '12px' }}>
                                        <span className="price-current">₹{item.price}</span>
                                        {item.originalPrice && (
                                            <>
                                                <span className="price-original">₹{item.originalPrice}</span>
                                                <span className="price-discount-percent">({item.discount}% OFF)</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Move to bag button bottom */}
                                <button 
                                    onClick={() => onMoveToBag(item.id)}
                                    style={{
                                        width: '100%', padding: '12px', background: '#ffffff',
                                        color: '#ff3f6c', borderTop: '1px solid #eaeaec', borderLeft: 'none',
                                        borderRight: 'none', borderBottom: 'none', fontWeight: '700',
                                        textTransform: 'uppercase', fontSize: '0.8rem', cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#f5f5f6'}
                                    onMouseLeave={(e) => e.target.style.background = '#ffffff'}
                                >
                                    Move to Bag
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
