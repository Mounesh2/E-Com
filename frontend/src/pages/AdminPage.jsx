import { useState, useEffect } from 'react';

export default function AdminPage({ token, onBack, onRefreshItems, items }) {
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProduct, setEditingProduct] = useState(null); // holds product object when editing

    // Form states for adding product
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [category, setCategory] = useState('Clothing');
    const [customCategory, setCustomCategory] = useState('');
    const [image, setImage] = useState('');
    const [additionalImages, setAdditionalImages] = useState('');
    const [description, setDescription] = useState('');
    const [bestseller, setBestseller] = useState(false);

    // Form states for editing product
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editOriginalPrice, setEditOriginalPrice] = useState('');
    const [editDiscount, setEditDiscount] = useState('');
    const [editCategory, setEditCategory] = useState('Clothing');
    const [editCustomCategory, setEditCustomCategory] = useState('');
    const [editImage, setEditImage] = useState('');
    const [editAdditionalImages, setEditAdditionalImages] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editBestseller, setEditBestseller] = useState(false);

    // Stats calculations
    const totalProducts = items.length;
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    const bestsellerCount = items.filter(item => item.bestseller).length;
    const uniqueCategories = [...new Set(items.map(item => item.category))].length;

    // Reset Add Form
    const resetAddForm = () => {
        setName('');
        setPrice('');
        setOriginalPrice('');
        setDiscount('');
        setCategory('Clothing');
        setCustomCategory('');
        setImage('');
        setAdditionalImages('');
        setDescription('');
        setBestseller(false);
    };

    // Trigger edit mode
    const handleStartEdit = (product) => {
        setEditingProduct(product);
        setEditName(product.name);
        setEditPrice(product.price);
        setEditOriginalPrice(product.originalPrice || '');
        setEditDiscount(product.discount || '');
        
        const standardCategories = ['Clothing', 'Electronics', 'Books'];
        if (standardCategories.includes(product.category)) {
            setEditCategory(product.category);
            setEditCustomCategory('');
        } else {
            setEditCategory('Other');
            setEditCustomCategory(product.category);
        }
        
        setEditImage(product.image);
        setEditAdditionalImages((product.images || []).join(', '));
        setEditDescription(product.description);
        setEditBestseller(product.bestseller || false);
    };

    // Handle product creation
    const handleCreateProduct = async (e) => {
        e.preventDefault();

        if (!name.trim() || !price || !image.trim() || !description.trim()) {
            alert('Please fill out all required fields: Name, Price, Main Image URL, and Description.');
            return;
        }

        const finalCategory = category === 'Other' ? customCategory.trim() : category;
        if (!finalCategory) {
            alert('Please specify a category.');
            return;
        }

        // Format additional images array
        const imagesArray = additionalImages.split(',')
            .map(url => url.trim())
            .filter(url => url !== '');
        
        // Always include primary image at first index if not already included
        if (imagesArray.indexOf(image.trim()) === -1) {
            imagesArray.unshift(image.trim());
        }

        const payload = {
            name: name.trim(),
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
            discount: discount ? parseInt(discount) : null,
            category: finalCategory,
            image: image.trim(),
            images: imagesArray,
            description: description.trim(),
            bestseller: bestseller
        };

        try {
            const res = await fetch('http://localhost:8000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Product created successfully!');
                resetAddForm();
                setActiveTab('list');
                onRefreshItems();
            } else {
                const err = await res.json();
                alert('Error creating product: ' + JSON.stringify(err));
            }
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Network error creating product');
        }
    };

    // Handle product update
    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        if (!editName.trim() || !editPrice || !editImage.trim() || !editDescription.trim()) {
            alert('Please fill out all required fields: Name, Price, Main Image URL, and Description.');
            return;
        }

        const finalCategory = editCategory === 'Other' ? editCustomCategory.trim() : editCategory;
        if (!finalCategory) {
            alert('Please specify a category.');
            return;
        }

        const imagesArray = editAdditionalImages.split(',')
            .map(url => url.trim())
            .filter(url => url !== '');
        
        if (imagesArray.indexOf(editImage.trim()) === -1) {
            imagesArray.unshift(editImage.trim());
        }

        const payload = {
            name: editName.trim(),
            price: parseFloat(editPrice),
            originalPrice: editOriginalPrice ? parseFloat(editOriginalPrice) : null,
            discount: editDiscount ? parseInt(editDiscount) : null,
            category: finalCategory,
            image: editImage.trim(),
            images: imagesArray,
            description: editDescription.trim(),
            bestseller: editBestseller
        };

        try {
            const res = await fetch(`http://localhost:8000/api/items/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Product updated successfully!');
                setEditingProduct(null);
                onRefreshItems();
            } else {
                const err = await res.json();
                alert('Error updating product: ' + JSON.stringify(err));
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Network error updating product');
        }
    };

    // Handle product deletion
    const handleDeleteProduct = async (productId) => {
        const confirmDelete = window.confirm('Are you sure you want to permanently delete this product?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:8000/api/items/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert('Product deleted successfully!');
                onRefreshItems();
            } else {
                alert('Failed to delete product. Make sure you are authorized.');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Network error deleting product');
        }
    };

    // Filter products list by search query
    const filteredProducts = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="page-container admin-dashboard">
            <div className="admin-header-row">
                <button className="back-btn" onClick={onBack}>← Storefront</button>
                <h2>⚙️ Vendor Control Panel</h2>
            </div>

            {/* Dashboard Quick Stats */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-info">
                        <span className="stat-num">{totalProducts}</span>
                        <span className="stat-label">Total Products</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <span className="stat-icon">💰</span>
                    <div className="stat-info">
                        <span className="stat-num">₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        <span className="stat-label">Catalog Value</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <span className="stat-icon">🔥</span>
                    <div className="stat-info">
                        <span className="stat-num">{bestsellerCount}</span>
                        <span className="stat-label">Bestsellers</span>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <span className="stat-icon">🏷️</span>
                    <div className="stat-info">
                        <span className="stat-num">{uniqueCategories}</span>
                        <span className="stat-label">Categories</span>
                    </div>
                </div>
            </div>

            {/* Admin Sub Navigation Tabs */}
            <div className="admin-tabs">
                <button 
                    className={`admin-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    All Products List
                </button>
                <button 
                    className={`admin-tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                    onClick={() => setActiveTab('add')}
                >
                    + Add New Product
                </button>
            </div>

            {/* Tab 1: Product List View */}
            {activeTab === 'list' && (
                <div className="admin-panel-card">
                    <div className="admin-panel-header">
                        <h3>Catalog Manager</h3>
                        <div className="admin-search-box">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text"
                                placeholder="Search by name, category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Thumbnail</th>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Original Price</th>
                                    <th>Bestseller</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#7e818c' }}>
                                            No products found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    className="admin-table-thumb"
                                                />
                                            </td>
                                            <td>
                                                <div className="admin-table-product-name">{product.name}</div>
                                                {product.discount && (
                                                    <span className="admin-table-discount-tag">{product.discount}% OFF</span>
                                                )}
                                            </td>
                                            <td><span className="admin-table-category-tag">{product.category}</span></td>
                                            <td><strong>₹{product.price}</strong></td>
                                            <td style={{ textDecoration: 'line-through', color: '#7e818c' }}>
                                                {product.originalPrice ? `₹${product.originalPrice}` : '-'}
                                            </td>
                                            <td>
                                                {product.bestseller ? (
                                                    <span className="admin-bestseller-dot yes" title="Bestseller Active">★ Yes</span>
                                                ) : (
                                                    <span className="admin-bestseller-dot no">No</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="admin-actions-row">
                                                    <button 
                                                        className="admin-action-btn edit"
                                                        onClick={() => handleStartEdit(product)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="admin-action-btn delete"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab 2: Create Product Form View */}
            {activeTab === 'add' && (
                <div className="admin-panel-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="admin-panel-header">
                        <h3>Add New Product to Catalog</h3>
                    </div>

                    <form onSubmit={handleCreateProduct} className="admin-form">
                        <div className="form-group">
                            <label>Product Name <span className="req">*</span></label>
                            <input 
                                type="text"
                                placeholder="e.g. Premium Cotton Shirt"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-row-3">
                            <div className="form-group">
                                <label>Selling Price (₹) <span className="req">*</span></label>
                                <input 
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 599"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Original Price (₹)</label>
                                <input 
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 999"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Discount (%)</label>
                                <input 
                                    type="number"
                                    placeholder="e.g. 40"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label>Category <span className="req">*</span></label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="Clothing">Clothing</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Books">Books</option>
                                    <option value="Other">Other Category (Type below)</option>
                                </select>
                            </div>
                            {category === 'Other' && (
                                <div className="form-group">
                                    <label>Custom Category Name <span className="req">*</span></label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. Footwear"
                                        value={customCategory}
                                        onChange={(e) => setCustomCategory(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Primary Image URL <span className="req">*</span></label>
                            <input 
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Additional Image URLs (Comma-separated)</label>
                            <textarea 
                                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                                value={additionalImages}
                                onChange={(e) => setAdditionalImages(e.target.value)}
                                rows="2"
                            />
                        </div>

                        <div className="form-group">
                            <label>Product Description <span className="req">*</span></label>
                            <textarea 
                                placeholder="Provide detail product properties, fabric material, sizing information, specifications..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="5"
                                required
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox"
                                    checked={bestseller}
                                    onChange={(e) => setBestseller(e.target.checked)}
                                />
                                Mark as Bestseller product (Displays on Home Page banner section)
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={resetAddForm}>Clear Fields</button>
                            <button type="submit" className="btn-primary">Add Product</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Editing Product Modal */}
            {editingProduct && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-content glass-panel">
                        <div className="admin-modal-header">
                            <h3>Edit Catalog Product</h3>
                            <button 
                                className="close-modal-btn"
                                onClick={() => setEditingProduct(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProduct} className="admin-form">
                            <div className="form-group">
                                <label>Product Name <span className="req">*</span></label>
                                <input 
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-row-3">
                                <div className="form-group">
                                    <label>Selling Price (₹) <span className="req">*</span></label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Original Price (₹)</label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={editOriginalPrice}
                                        onChange={(e) => setEditOriginalPrice(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Discount (%)</label>
                                    <input 
                                        type="number"
                                        value={editDiscount}
                                        onChange={(e) => setEditDiscount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Category <span className="req">*</span></label>
                                    <select 
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                    >
                                        <option value="Clothing">Clothing</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Books">Books</option>
                                        <option value="Other">Other Category (Type below)</option>
                                    </select>
                                </div>
                                {editCategory === 'Other' && (
                                    <div className="form-group">
                                        <label>Custom Category Name <span className="req">*</span></label>
                                        <input 
                                            type="text"
                                            value={editCustomCategory}
                                            onChange={(e) => setEditCustomCategory(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Primary Image URL <span className="req">*</span></label>
                                <input 
                                    type="url"
                                    value={editImage}
                                    onChange={(e) => setEditImage(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Additional Image URLs (Comma-separated)</label>
                                <textarea 
                                    value={editAdditionalImages}
                                    onChange={(e) => setEditAdditionalImages(e.target.value)}
                                    rows="2"
                                />
                            </div>

                            <div className="form-group">
                                <label>Product Description <span className="req">*</span></label>
                                <textarea 
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox"
                                        checked={editBestseller}
                                        onChange={(e) => setEditBestseller(e.target.checked)}
                                    />
                                    Mark as Bestseller product
                                </label>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setEditingProduct(null)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
