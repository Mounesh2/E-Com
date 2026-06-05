import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ThemeSelector from './components/ThemeSelector';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import { API_BASE_URL } from './config';

export default function App() {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('items');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    // Myntra integration states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setToken(null);
        setUser(null);
        setCart([]);
        setWishlist([]);
        setCurrentPage('items');
        setSelectedCategory('');
        setSearchQuery('');
    }

    const loadItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/items`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    // Load catalog items once on mount
    useEffect(() => {
        loadItems();
    }, []);

    // Load user details when token changes
    useEffect(() => {
        const fetchUserProfile = async (currentToken) => {
            if (!currentToken) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/profile`, {
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                if (response.ok) {
                    const profile = await response.json();
                    setUser(profile);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        const loadCart = async (currentToken) => {
            if (!currentToken) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/cart`, {
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCart(data);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        const loadWishlist = async (currentToken) => {
            if (!currentToken) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setWishlist(data);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };

        if (token) {
            fetchUserProfile(token);
            loadCart(token);
            loadWishlist(token);
        } else {
            Promise.resolve().then(() => {
                setUser(null);
                setCart([]);
                setWishlist([]);
            });
        }
    }, [token]);

    const handleLoginSuccess = (newToken, email) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('userEmail', email);
        setToken(newToken);
        setCurrentPage('items');
    };

    const handleAddToCart = async (itemId, size = 'M') => {
        if (!token) {
            alert('Please login to add items to your bag.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ itemId, size })
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data);
                alert(`Added size ${size} to your Bag!`);
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to add item to bag');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Network error adding to bag');
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setCart(data);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleAddToWishlist = async (itemId) => {
        if (!token) {
            alert('Please login to add items to your wishlist.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ itemId })
            });

            if (response.ok) {
                const data = await response.json();
                setWishlist(data);
                alert('Item saved to your Wishlist!');
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const handleRemoveFromWishlist = async (itemId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/wishlist/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setWishlist(data);
            }
        } catch (error) {
            console.error('Error removing wishlist item:', error);
        }
    };

    const handleMoveToBag = async (itemId) => {
        // Step 1: Add to bag with default size 'M'
        await handleAddToCart(itemId, 'M');
        // Step 2: Delete from wishlist
        await handleRemoveFromWishlist(itemId);
    };

    const handleShowDetail = (id) => {
        setSelectedProductId(id);
        setCurrentPage('product-detail');
    };

    const handleCheckoutSuccess = () => {
        setCart([]);
        setCurrentPage('profile');
    };

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
        setCurrentPage('products');
    };

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const renderPageContent = () => {
        // Pages that require login
        const authRequiredPages = ['cart', 'profile', 'wishlist'];
        if (!token && authRequiredPages.includes(currentPage)) {
            return <AuthPage onLoginSuccess={handleLoginSuccess} />;
        }
        // Show auth page when user clicks Login button
        if (currentPage === 'auth') {
            return <AuthPage onLoginSuccess={handleLoginSuccess} />;
        }

        switch (currentPage) {
            case 'items':
                return (
                    <HomePage 
                        items={items} 
                        onAddToCart={handleAddToCart} 
                        onShowDetail={handleShowDetail}
                        onCategorySelect={handleCategorySelect}
                    />
                );
            case 'products':
                return (
                    <ProductsPage 
                        onAddToCart={handleAddToCart} 
                        onShowDetail={handleShowDetail}
                        searchQuery={searchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                );
            case 'product-detail':
                return (
                    <ProductDetailPage 
                        itemId={selectedProductId}
                        onAddToCart={handleAddToCart}
                        onShowDetail={handleShowDetail}
                        onAddToWishlist={handleAddToWishlist}
                        onBack={() => setCurrentPage('products')}
                    />
                );
            case 'cart':
                return (
                    <CartPage 
                        cart={cart}
                        onRemoveItem={handleRemoveFromCart}
                        token={token}
                        onCheckoutSuccess={handleCheckoutSuccess}
                    />
                );
            case 'profile':
                return (
                    <ProfilePage 
                        token={token}
                        onBack={() => setCurrentPage('items')}
                    />
                );
            case 'wishlist':
                return (
                    <WishlistPage 
                        wishlist={wishlist}
                        onRemoveFromWishlist={handleRemoveFromWishlist}
                        onMoveToBag={handleMoveToBag}
                    />
                );
            case 'about':
                return <AboutPage />;
            case 'contact':
                return <ContactPage />;
            case 'admin':
                return (
                    <AdminPage 
                        token={token}
                        items={items}
                        onBack={() => setCurrentPage('items')}
                        onRefreshItems={loadItems}
                    />
                );
            default:
                return (
                    <HomePage 
                        items={items} 
                        onAddToCart={handleAddToCart} 
                        onShowDetail={handleShowDetail}
                        onCategorySelect={handleCategorySelect}
                    />
                );
        }
    };

    return (
        <div id="app">
            <Navbar 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                cartCount={cartCount}
                user={user}
                onLogout={handleLogout}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setSelectedCategory={setSelectedCategory}
                items={items}
                onShowDetail={handleShowDetail}
            />

            <main style={{ minHeight: 'calc(100vh - 200px)' }}>
                {renderPageContent()}
            </main>

            <ThemeSelector />

            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} Trendify. All rights reserved.</p>
                    <p>
                        Designed and developed with ❤️ resembling premium fashion portal experience | 
                        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('admin'); }} style={{ color: 'var(--theme-primary)', marginLeft: '8px', textDecoration: 'underline', fontWeight: '700' }}>
                            Open Admin Panel Demo
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
