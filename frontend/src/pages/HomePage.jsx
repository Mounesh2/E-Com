
import ItemCard from '../components/ItemCard';

export default function HomePage({ items, onAddToCart, onShowDetail, onCategorySelect }) {
    const dealsOfTheDay = [...items]
        .filter(item => item.discount)
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 5);

    const bestSellers = items.filter(item => item.bestseller).slice(0, 5);

    const categoriesList = [
        {
            name: 'Clothing',
            label: 'Fashion Wear',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
            name: 'Electronics',
            label: 'Tech Gadgets',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
            name: 'Books',
            label: 'Novel & Guides',
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        }
    ];

    return (
        <div className="page-container">
            {/* Promo Banner Slider */}
            <div className="home-banner-card">
                <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80" 
                    alt="Season Sale Banner" 
                    className="home-banner-img"
                />
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '6%', color: 'white'
                }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '1px' }}>FLAT 50% OFF</h2>
                    <p style={{ fontSize: '1.4rem', fontWeight: '300', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        On Premium Lifestyle Essentials
                    </p>
                    <button 
                        onClick={() => onCategorySelect('')}
                        style={{
                            alignSelf: 'flex-start', marginTop: '20px', padding: '12px 28px',
                            background: '#ff3f6c', color: 'white', border: 'none', fontWeight: '700',
                            textTransform: 'uppercase', borderRadius: '4px', cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(255, 63, 108, 0.3)'
                        }}
                    >
                        Explore Catalog
                    </button>
                </div>
            </div>

            {/* Categories to Bag */}
            <div className="categories-to-bag-section">
                <h3 className="categories-title">Categories to bag</h3>
                <div className="categories-circles-grid">
                    {categoriesList.map(cat => (
                        <div 
                            key={cat.name} 
                            className="category-circle-item"
                            onClick={() => onCategorySelect(cat.name)}
                        >
                            <img src={cat.image} alt={cat.label} className="category-circle-img" />
                            <span className="category-circle-label">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Deals of the Day */}
            <div className="home-section">
                <h2 className="section-title">Deals of the Day</h2>
                <div className="home-items-grid">
                    {dealsOfTheDay.map(item => (
                        <ItemCard 
                            key={item.id} 
                            item={item} 
                            onAddToCart={onAddToCart} 
                            onShowDetail={onShowDetail} 
                        />
                    ))}
                </div>
            </div>

            {/* Best Sellers */}
            <div className="home-section">
                <h2 className="section-title">Best Sellers</h2>
                <div className="home-items-grid">
                    {bestSellers.map(item => (
                        <ItemCard 
                            key={item.id} 
                            item={item} 
                            onAddToCart={onAddToCart} 
                            onShowDetail={onShowDetail} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
