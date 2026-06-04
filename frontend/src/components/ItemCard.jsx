

export default function ItemCard({ item, onAddToCart, onShowDetail }) {
    const isBestseller = item.bestseller;
    const hasDiscount = !!item.discount;

    // Split name to simulate Brand & Subtitle
    const nameParts = item.name.split(' ');
    const brand = nameParts[0];
    const subtitle = nameParts.slice(1).join(' ') || item.name;

    const handleAddToCartClick = (e) => {
        e.stopPropagation(); // Prevent trigger details navigation
        onAddToCart(item.id);
    };

    return (
        <div className="item-card" onClick={() => onShowDetail(item.id)}>
            <div className="item-image-wrapper">
                {isBestseller && <div className="bestseller-badge">🏆 Bestseller</div>}
                {hasDiscount && <div className="discount-badge">-{item.discount}%</div>}
                <img 
                    src={item.image} 
                    alt={item.name} 
                    className="item-card-image"
                />
                
                {/* Myntra Slide Up Add to Bag */}
                <div className="item-card-hover-action">
                    <button 
                        className="item-card-hover-btn" 
                        onClick={handleAddToCartClick}
                    >
                        ➕ Add to Bag
                    </button>
                </div>
            </div>

            <div className="item-card-content">
                <div className="item-card-brand">{brand}</div>
                <h3>{subtitle}</h3>
                
                <div className="item-card-price-row">
                    <span className="price-current">₹{item.price}</span>
                    {item.originalPrice && (
                        <>
                            <span className="price-original">₹{item.originalPrice}</span>
                            <span className="price-discount-percent">({item.discount}% OFF)</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
