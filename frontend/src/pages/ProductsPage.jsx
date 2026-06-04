import { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';

export default function ProductsPage({ 
    onAddToCart, 
    onShowDetail,
    searchQuery,
    selectedCategory,
    setSelectedCategory
}) {
    const [filteredItems, setFilteredItems] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [discountMin, setDiscountMin] = useState('');
    const [sortBy, setSortBy] = useState('recommended');

    // Reload products when filters or search queries change
    useEffect(() => {
        const loadProducts = async () => {
            let url = 'http://localhost:8000/api/items?';
            if (selectedCategory) url += `category=${selectedCategory}&`;
            if (minPrice) url += `minPrice=${minPrice}&`;
            if (maxPrice) url += `maxPrice=${maxPrice}&`;

            try {
                const response = await fetch(url);
                let data = await response.json();

                // Local Search Filter
                if (searchQuery) {
                    data = data.filter(item => 
                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                // Local Discount Filter
                if (discountMin) {
                    data = data.filter(item => item.discount && item.discount >= parseInt(discountMin));
                }

                // Local Sorting
                if (sortBy === 'price-low') {
                    data.sort((a, b) => a.price - b.price);
                } else if (sortBy === 'price-high') {
                    data.sort((a, b) => b.price - a.price);
                } else if (sortBy === 'name') {
                    data.sort((a, b) => a.name.localeCompare(b.name));
                } else if (sortBy === 'discount') {
                    data.sort((a, b) => (b.discount || 0) - (a.discount || 0));
                }

                setFilteredItems(data);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        };

        loadProducts();
    }, [selectedCategory, minPrice, maxPrice, discountMin, sortBy, searchQuery]);

    const handleClearAll = () => {
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setDiscountMin('');
        setSortBy('recommended');
    };

    return (
        <div className="page-container" style={{ margin: '20px auto' }}>
            {/* Page header path trace */}
            <div style={{ fontSize: '0.85rem', color: '#7e818c', marginBottom: '20px' }}>
                Home / {selectedCategory || 'All Products'} {searchQuery && `/ Search results for "${searchQuery}"`}
            </div>

            <div className="catalog-layout">
                {/* Sidebar filters column */}
                <aside className="catalog-sidebar">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #eaeaec' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.95rem', textTransform: 'uppercase' }}>Filters</span>
                        <span 
                            onClick={handleClearAll}
                            style={{ color: '#ff3f6c', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}
                        >
                            Clear All
                        </span>
                    </div>

                    {/* Category Filter */}
                    <div className="filter-section">
                        <h4 className="filter-section-title">Categories</h4>
                        {['Clothing', 'Electronics', 'Books'].map(cat => (
                            <label key={cat} className="filter-checkbox-label">
                                <input 
                                    type="radio" 
                                    name="category"
                                    checked={selectedCategory === cat}
                                    onChange={() => setSelectedCategory(cat)}
                                />
                                <span>{cat}</span>
                            </label>
                        ))}
                    </div>

                    {/* Price Filter */}
                    <div className="filter-section">
                        <h4 className="filter-section-title">Price Range</h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                                type="number" 
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                style={{ width: '100%', padding: '6px', border: '1px solid #eaeaec', fontSize: '0.85rem' }}
                            />
                            <span style={{ color: '#7e818c' }}>to</span>
                            <input 
                                type="number" 
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                style={{ width: '100%', padding: '6px', border: '1px solid #eaeaec', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>

                    {/* Discount Range Filter */}
                    <div className="filter-section">
                        <h4 className="filter-section-title">Discount Range</h4>
                        {[10, 20, 30, 40].map(disc => (
                            <label key={disc} className="filter-checkbox-label">
                                <input 
                                    type="radio" 
                                    name="discount"
                                    checked={discountMin === String(disc)}
                                    onChange={() => setDiscountMin(String(disc))}
                                />
                                <span>{disc}% and above</span>
                            </label>
                        ))}
                    </div>
                </aside>

                {/* Products Grid column */}
                <main className="catalog-content">
                    <div className="catalog-header">
                        <div className="catalog-count-text">
                            <strong>{selectedCategory || 'All items'}</strong> - {filteredItems.length} products found
                        </div>
                        
                        <select 
                            className="catalog-sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="recommended">Sort by: Recommended</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="discount">Better Discount</option>
                            <option value="name">Product Name (A-Z)</option>
                        </select>
                    </div>

                    {filteredItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', color: '#535766' }}>
                            <h3>No items found matching the selected filters.</h3>
                            <button 
                                onClick={handleClearAll}
                                style={{
                                    marginTop: '15px', padding: '10px 20px', background: '#ff3f6c',
                                    color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer'
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="home-items-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                            {filteredItems.map(item => (
                                <ItemCard 
                                    key={item.id} 
                                    item={item} 
                                    onAddToCart={onAddToCart} 
                                    onShowDetail={onShowDetail} 
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
