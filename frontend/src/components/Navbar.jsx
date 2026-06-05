import { useState } from 'react';

export default function Navbar({ 
    currentPage, 
    setCurrentPage, 
    cartCount, 
    user, 
    onLogout,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    items = [],
    onShowDetail
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavCategoryClick = (categoryName, e) => {
        e.preventDefault();
        setSelectedCategory(categoryName);
        setCurrentPage('products');
        setMobileMenuOpen(false);
    };

    const handlePageNavigation = (page, e) => {
        e.preventDefault();
        setCurrentPage(page);
        setMobileMenuOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (currentPage !== 'products' && currentPage !== 'product-detail') {
            setCurrentPage('products');
        }
    };

    return (
        <>
            <nav>
                <div className="nav-left">
                    <div className="nav-brand" onClick={(e) => handlePageNavigation('items', e)}>
                        🛍️ Trendify
                    </div>
                    <ul className="nav-links">
                            <li>
                                <a 
                                    href="#" 
                                    className={currentPage === 'products' ? 'active' : ''} 
                                    onClick={(e) => handleNavCategoryClick('Clothing', e)}
                                >
                                    Men
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#" 
                                    onClick={(e) => handleNavCategoryClick('Clothing', e)}
                                >
                                    Women
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#" 
                                    onClick={(e) => handleNavCategoryClick('Books', e)}
                                >
                                    Kids
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#" 
                                    onClick={(e) => handleNavCategoryClick('Electronics', e)}
                                >
                                    Home & Living
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#" 
                                    onClick={(e) => handleNavCategoryClick('Electronics', e)}
                                >
                                    Beauty
                                </a>
                            </li>
                        </ul>
                </div>

                {/* Search Bar - Center aligned */}
                <div className="nav-search-container" style={{ position: 'relative' }}>
                        <span className="nav-search-icon">🔍</span>
                        <input 
                            type="text" 
                            className="nav-search-input" 
                            placeholder="Search for products, brands and more"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        {searchQuery.trim() !== '' && (
                            <div className="search-suggestions-dropdown">
                                {items.filter(item => 
                                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
                                ).slice(0, 8).map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="suggestion-item"
                                        onClick={() => {
                                            onShowDetail(item.id);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <img src={item.image} alt={item.name} className="suggestion-image" />
                                        <div className="suggestion-info">
                                            <span className="suggestion-name">{item.name}</span>
                                            <span className="suggestion-category">{item.category}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                <div className="nav-right">
                    {user ? (
                        <div className="nav-user-actions">
                            {/* Admin action */}
                            {user && user.is_staff && (
                                <div 
                                    className="nav-action-item" 
                                    onClick={(e) => handlePageNavigation('admin', e)}
                                >
                                    <span className="nav-action-icon">⚙️</span>
                                    <span>Admin</span>
                                </div>
                            )}

                            {/* Profile action */}
                            <div 
                                className="nav-action-item" 
                                onClick={(e) => handlePageNavigation('profile', e)}
                            >
                                <span className="nav-action-icon">👤</span>
                                <span>Profile</span>
                            </div>

                            {/* Wishlist action */}
                            <div 
                                className="nav-action-item"
                                onClick={(e) => handlePageNavigation('wishlist', e)}
                            >
                                <span className="nav-action-icon">🤍</span>
                                <span>Wishlist</span>
                            </div>

                            {/* Bag (Cart) action */}
                            <div 
                                className="nav-action-item" 
                                onClick={(e) => handlePageNavigation('cart', e)}
                            >
                                <span className="nav-action-icon">👜</span>
                                <span>Bag</span>
                                {cartCount > 0 && (
                                    <span className="nav-action-badge">{cartCount}</span>
                                )}
                            </div>

                            <button 
                                onClick={onLogout} 
                                style={{
                                    padding: '6px 12px',
                                    background: 'none',
                                    border: '1px solid #d4d5d9',
                                    borderRadius: '2px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    marginLeft: '10px'
                                }}
                            >
                                Logout
                            </button>

                            <div 
                                className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`} 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    ) : (
                        <div className="nav-user-actions">
                            <div 
                                className="nav-action-item"
                                onClick={(e) => handlePageNavigation('auth', e)}
                                style={{ cursor: 'pointer' }}
                            >
                                <span className="nav-action-icon">👤</span>
                                <span>Login</span>
                            </div>
                            <div 
                                className="nav-action-item" 
                                onClick={(e) => handlePageNavigation('cart', e)}
                            >
                                <span className="nav-action-icon">👜</span>
                                <span>Bag</span>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Nav Menu */}
            {user && mobileMenuOpen && (
                <div className="mobile-nav active">
                    <div className="mobile-nav-content">
                        <ul className="mobile-nav-links">
                            <li><a href="#" onClick={(e) => handleNavCategoryClick('Clothing', e)}>Men & Women</a></li>
                            <li><a href="#" onClick={(e) => handleNavCategoryClick('Books', e)}>Kids</a></li>
                            <li><a href="#" onClick={(e) => handleNavCategoryClick('Electronics', e)}>Home & Living</a></li>
                            <li><a href="#" onClick={(e) => handlePageNavigation('profile', e)}>My Profile</a></li>
                            <li><a href="#" onClick={(e) => handlePageNavigation('cart', e)}>My Bag ({cartCount})</a></li>
                            {user && user.is_staff && (
                                <li><a href="#" onClick={(e) => handlePageNavigation('admin', e)}>Admin Control</a></li>
                            )}
                        </ul>
                        <div className="mobile-nav-buttons">
                            <button onClick={onLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
