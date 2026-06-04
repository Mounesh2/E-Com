// ==========================================
// CLIENT LOGIC: Trendify Standalone Admin Portal
// ==========================================

const API_BASE_URL = 'http://localhost:8000/api';

// Application State
let token = localStorage.getItem('token') || null;
let user = null;
let products = [];
let categoryChart = null;

// DOM Elements - Navigation and Containers
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const sidebarMenu = document.querySelector('.sidebar-menu');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

// DOM Elements - User Session
const userNameEl = document.getElementById('user-name');
const userEmailEl = document.getElementById('user-email');
const btnLogout = document.getElementById('btn-logout');
const btnRefreshData = document.getElementById('btn-refresh-data');

// DOM Elements - Authentication Form
const loginForm = document.getElementById('login-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginError = document.getElementById('login-error');

const registerForm = document.getElementById('register-form');
const registerEmailInput = document.getElementById('register-email');
const registerNameInput = document.getElementById('register-name');
const registerPhoneInput = document.getElementById('register-phone');
const registerPasswordInput = document.getElementById('register-password');
const registerAddressInput = document.getElementById('register-address');
const registerError = document.getElementById('register-error');
const registerSuccess = document.getElementById('register-success');

const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');

// DOM Elements - Stats
const statTotalProducts = document.getElementById('stat-total-products');
const statTotalValue = document.getElementById('stat-total-value');
const statBestsellers = document.getElementById('stat-bestsellers');
const statCategories = document.getElementById('stat-categories');

// DOM Elements - Table & Search
const searchInput = document.getElementById('search-input');
const productsTableBody = document.getElementById('products-table-body');

// DOM Elements - Add Product Form
const addProductForm = document.getElementById('add-product-form');
const addName = document.getElementById('add-name');
const addPrice = document.getElementById('add-price');
const addOriginalPrice = document.getElementById('add-original-price');
const addDiscount = document.getElementById('add-discount');
const addCategory = document.getElementById('add-category');
const addCustomCategory = document.getElementById('add-custom-category');
const customCategoryGroup = document.getElementById('custom-category-group');
const addImage = document.getElementById('add-image');
const addAdditionalImages = document.getElementById('add-additional-images');
const addDescription = document.getElementById('add-description');
const addBestseller = document.getElementById('add-bestseller');
const btnAddClear = document.getElementById('btn-add-clear');

// DOM Elements - Edit Modal & Form
const editModal = document.getElementById('edit-modal');
const editProductForm = document.getElementById('edit-product-form');
const editId = document.getElementById('edit-id');
const editName = document.getElementById('edit-name');
const editPrice = document.getElementById('edit-price');
const editOriginalPrice = document.getElementById('edit-original-price');
const editDiscount = document.getElementById('edit-discount');
const editCategory = document.getElementById('edit-category');
const editCustomCategory = document.getElementById('edit-custom-category');
const editCustomCategoryGroup = document.getElementById('edit-custom-category-group');
const editImage = document.getElementById('edit-image');
const editAdditionalImages = document.getElementById('edit-additional-images');
const editDescription = document.getElementById('edit-description');
const editBestseller = document.getElementById('edit-bestseller');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnEditCancel = document.getElementById('btn-edit-cancel');

// ==========================================
// INITIALIZATION & SESSION CHECK
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    if (token) {
        verifySession();
    } else {
        showLogin();
    }
});

// Setup global DOM event listeners
function setupEventListeners() {
    // Auth events
    loginForm.addEventListener('submit', handleLogin);
    btnLogout.addEventListener('click', handleLogout);

    // Auth switching events
    linkToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginError.classList.add('hidden');
    });

    linkToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        registerError.classList.add('hidden');
        registerSuccess.classList.add('hidden');
    });

    registerForm.addEventListener('submit', handleRegister);

    // Refresh click
    btnRefreshData.addEventListener('click', () => {
        syncData();
    });

    // Tab switching
    sidebarMenu.addEventListener('click', handleTabSwitch);

    // Dynamic category selector behaviors
    addCategory.addEventListener('change', (e) => {
        if (e.target.value === 'Other') {
            customCategoryGroup.classList.remove('hidden');
        } else {
            customCategoryGroup.classList.add('hidden');
        }
    });

    editCategory.addEventListener('change', (e) => {
        if (e.target.value === 'Other') {
            editCustomCategoryGroup.classList.remove('hidden');
        } else {
            editCustomCategoryGroup.classList.add('hidden');
        }
    });

    // Search filter input
    searchInput.addEventListener('input', () => {
        renderProductsTable();
    });

    // Form Submissions
    addProductForm.addEventListener('submit', handleAddProduct);
    editProductForm.addEventListener('submit', handleUpdateProduct);
    
    // Clear & Cancel buttons
    btnAddClear.addEventListener('click', () => addProductForm.reset());
    btnEditCancel.addEventListener('click', () => editModal.classList.add('hidden'));
    btnCloseModal.addEventListener('click', () => editModal.classList.add('hidden'));
}

// ==========================================
// SESSION MANAGEMENT (LOGIN/LOGOUT)
// ==========================================

// Authenticate session and fetch user profile
async function verifySession() {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            user = await response.json();
            
            // Check if user is staff/admin
            if (!user.is_staff) {
                showError("Access Denied: You must be an administrator to log into this portal.");
                handleLogout();
                return;
            }

            // Expose user details on sidebar
            userNameEl.textContent = user.fullName;
            userEmailEl.textContent = user.email;

            showDashboard();
            syncData();
        } else {
            // Token expired or invalid
            handleLogout();
        }
    } catch (error) {
        console.error('Session verification error:', error);
        showLogin();
    }
}

// Handle login submission
async function handleLogin(e) {
    e.preventDefault();
    loginError.classList.add('hidden');
    loginError.textContent = '';

    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            localStorage.setItem('token', token);
            verifySession();
        } else {
            showError(data.error || 'Invalid credentials provided.');
        }
    } catch (error) {
        console.error('Login request error:', error);
        showError('Network error connecting to Django backend.');
    }
}

// Handle registration submission
async function handleRegister(e) {
    e.preventDefault();
    registerError.classList.add('hidden');
    registerSuccess.classList.add('hidden');

    const email = registerEmailInput.value.trim();
    const name = registerNameInput.value.trim();
    const phone = registerPhoneInput.value.trim();
    const password = registerPasswordInput.value;
    const address = registerAddressInput.value.trim() || "Address not provided";

    const payload = {
        email,
        fullName: name,
        phone,
        password,
        address,
        is_staff: true  // Requesting admin level permissions
    };

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            registerSuccess.textContent = "Admin account registered successfully! You can now log in.";
            registerSuccess.classList.remove('hidden');
            registerForm.reset();
            
            // Auto switch to login form after 2 seconds
            setTimeout(() => {
                linkToLogin.click();
                loginEmailInput.value = email;
            }, 2000);
        } else {
            registerError.textContent = data.error || 'Registration failed. Check validations.';
            registerError.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Registration error:', error);
        registerError.textContent = 'Network error connecting to signup service.';
        registerError.classList.remove('hidden');
    }
}

// Clear session credentials and redirect
function handleLogout() {
    token = null;
    user = null;
    localStorage.removeItem('token');
    showLogin();
}

function showLogin() {
    loginContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
}

function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
}

function showError(message) {
    loginError.textContent = message;
    loginError.classList.remove('hidden');
}

// ==========================================
// DATA ACQUISITION & RENDER
// ==========================================

async function syncData() {
    btnRefreshData.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Syncing...`;
    btnRefreshData.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/items`);
        if (response.ok) {
            products = await response.json();
            
            // Calculate stats
            renderStats();
            renderProductsTable();
            renderCategoryChart();
        } else {
            alert('Failed to synchronize items.');
        }
    } catch (error) {
        console.error('Data sync error:', error);
        alert('Network connection error sync catalog items.');
    } finally {
        btnRefreshData.innerHTML = `<i class="fa-solid fa-rotate"></i> Sync Data`;
        btnRefreshData.disabled = false;
    }
}

// Calculate and render stats row
function renderStats() {
    statTotalProducts.textContent = products.length;
    
    const value = products.reduce((sum, item) => sum + item.price, 0);
    statTotalValue.textContent = `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    
    statBestsellers.textContent = products.filter(item => item.bestseller).length;
    
    const categories = [...new Set(products.map(item => item.category))];
    statCategories.textContent = categories.length;
}

// Render dynamic rows in the table
function renderProductsTable() {
    productsTableBody.innerHTML = '';
    const query = searchInput.value.toLowerCase().trim();

    const filtered = products.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        String(item.id).includes(query)
    );

    if (filtered.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">
                    No products matching your search query.
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" class="table-thumb"></td>
            <td><span class="product-id-tag">#${item.id}</span></td>
            <td>
                <div class="product-title-cell">
                    <span class="product-name-txt">${item.name}</span>
                    <span class="product-desc-txt">${item.description}</span>
                </div>
            </td>
            <td><span class="category-badge">${item.category}</span></td>
            <td><strong>₹${item.price}</strong></td>
            <td>
                ${item.discount ? `<span class="admin-table-discount-tag" style="font-size: 0.7rem; font-weight: 700; background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); padding: 2px 6px; border-radius: 4px;">${item.discount}% OFF</span>` : '-'}
            </td>
            <td>
                <span class="bestseller-status ${item.bestseller ? 'yes' : 'no'}">
                    ${item.bestseller ? '<i class="fa-solid fa-star"></i> Bestseller' : 'No'}
                </span>
            </td>
            <td>
                <div class="table-actions-row">
                    <button class="action-btn-icon edit" data-id="${item.id}" title="Edit Product"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn-icon delete" data-id="${item.id}" title="Delete Product"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;

        // Action button listeners
        row.querySelector('.edit').addEventListener('click', () => openEditModal(item));
        row.querySelector('.delete').addEventListener('click', () => handleDeleteProduct(item.id));

        productsTableBody.appendChild(row);
    });
}

// Chart.js renderer
function renderCategoryChart() {
    // Count items by category
    const categoriesCount = {};
    products.forEach(item => {
        categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1;
    });

    const labels = Object.keys(categoriesCount);
    const data = Object.values(categoriesCount);

    if (categoryChart) {
        categoryChart.destroy();
    }

    const ctx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Products',
                data: data,
                backgroundColor: [
                    'rgba(99, 102, 241, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(168, 85, 247, 0.6)',
                    'rgba(244, 63, 94, 0.6)'
                ],
                borderColor: [
                    'rgb(99, 102, 241)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(168, 85, 247)',
                    'rgb(244, 63, 94)'
                ],
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// ==========================================
// TABS SWITCH LOGIC
// ==========================================

function handleTabSwitch(e) {
    const menuItem = e.target.closest('.menu-item');
    if (!menuItem) return;

    e.preventDefault();

    // Toggle menu active classes
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(li => li.classList.remove('active'));
    menuItem.classList.add('active');

    // Toggle tab display
    const selectedTab = menuItem.dataset.tab;
    tabContents.forEach(section => {
        if (section.id === selectedTab) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });

    // Update Header title
    const menuLabel = menuItem.querySelector('span').textContent;
    pageTitle.textContent = menuLabel;
    
    if (selectedTab === 'tab-overview') {
        pageSubtitle.textContent = 'Real-time statistics and product metrics.';
    } else if (selectedTab === 'tab-products') {
        pageSubtitle.textContent = 'Browse, edit, or delete items in the vendor catalogue.';
    } else if (selectedTab === 'tab-add-product') {
        pageSubtitle.textContent = 'Instantly publish a new item to the user storefront.';
    }
}

// ==========================================
// DATABASE WRITE OPERATIONS (CRUD)
// ==========================================

// HANDLE PRODUCT CREATE
async function handleAddProduct(e) {
    e.preventDefault();

    const nameVal = addName.value.trim();
    const priceVal = parseFloat(addPrice.value);
    const origPriceVal = addOriginalPrice.value ? parseFloat(addOriginalPrice.value) : null;
    const discountVal = addDiscount.value ? parseInt(addDiscount.value) : null;
    const imageVal = addImage.value.trim();
    const descVal = addDescription.value.trim();
    const bestsellerVal = addBestseller.checked;

    let finalCategory = addCategory.value;
    if (finalCategory === 'Other') {
        finalCategory = addCustomCategory.value.trim();
        if (!finalCategory) {
            alert('Please specify a custom category name.');
            return;
        }
    }

    const imagesArray = addAdditionalImages.value.split(',')
        .map(url => url.trim())
        .filter(url => url !== '');
    
    if (imagesArray.indexOf(imageVal) === -1) {
        imagesArray.unshift(imageVal);
    }

    const payload = {
        name: nameVal,
        price: priceVal,
        originalPrice: origPriceVal,
        discount: discountVal,
        category: finalCategory,
        image: imageVal,
        images: imagesArray,
        description: descVal,
        bestseller: bestsellerVal
    };

    try {
        const response = await fetch(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Product created successfully!');
            addProductForm.reset();
            customCategoryGroup.classList.add('hidden');
            
            // Go back to list tab
            document.querySelector('[data-tab="tab-products"]').click();
            syncData();
        } else {
            const err = await response.json();
            alert('Error creating product: ' + JSON.stringify(err));
        }
    } catch (error) {
        console.error('Error creating product:', error);
        alert('Network communication error creating product.');
    }
}

// HANDLE PRODUCT DELETE
async function handleDeleteProduct(productId) {
    const confirmDelete = window.confirm('Are you sure you want to delete this product? This action is permanent.');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${API_BASE_URL}/items/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Product deleted successfully!');
            syncData();
        } else {
            alert('Failed to delete product. Make sure you are authorized.');
        }
    } catch (error) {
        console.error('Delete request error:', error);
        alert('Network connection error deleting product.');
    }
}

// HANDLE EDIT MODAL PREFILL
function openEditModal(product) {
    editId.value = product.id;
    editName.value = product.name;
    editPrice.value = product.price;
    editOriginalPrice.value = product.originalPrice || '';
    editDiscount.value = product.discount || '';

    const standardCategories = ['Clothing', 'Electronics', 'Books'];
    if (standardCategories.includes(product.category)) {
        editCategory.value = product.category;
        editCustomCategory.value = '';
        editCustomCategoryGroup.classList.add('hidden');
    } else {
        editCategory.value = 'Other';
        editCustomCategory.value = product.category;
        editCustomCategoryGroup.classList.remove('hidden');
    }

    editImage.value = product.image;
    editAdditionalImages.value = (product.images || []).join(', ');
    editDescription.value = product.description;
    editBestseller.checked = product.bestseller || false;

    // Show modal overlay
    editModal.classList.remove('hidden');
}

// HANDLE PRODUCT UPDATE
async function handleUpdateProduct(e) {
    e.preventDefault();

    const productId = editId.value;
    const nameVal = editName.value.trim();
    const priceVal = parseFloat(editPrice.value);
    const origPriceVal = editOriginalPrice.value ? parseFloat(editOriginalPrice.value) : null;
    const discountVal = editDiscount.value ? parseInt(editDiscount.value) : null;
    const imageVal = editImage.value.trim();
    const descVal = editDescription.value.trim();
    const bestsellerVal = editBestseller.checked;

    let finalCategory = editCategory.value;
    if (finalCategory === 'Other') {
        finalCategory = editCustomCategory.value.trim();
        if (!finalCategory) {
            alert('Please specify a category name.');
            return;
        }
    }

    const imagesArray = editAdditionalImages.value.split(',')
        .map(url => url.trim())
        .filter(url => url !== '');
    
    if (imagesArray.indexOf(imageVal) === -1) {
        imagesArray.unshift(imageVal);
    }

    const payload = {
        name: nameVal,
        price: priceVal,
        originalPrice: origPriceVal,
        discount: discountVal,
        category: finalCategory,
        image: imageVal,
        images: imagesArray,
        description: descVal,
        bestseller: bestsellerVal
    };

    try {
        const response = await fetch(`${API_BASE_URL}/items/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Product updated successfully!');
            editModal.classList.add('hidden');
            syncData();
        } else {
            const err = await response.json();
            alert('Error updating product: ' + JSON.stringify(err));
        }
    } catch (error) {
        console.error('Update request error:', error);
        alert('Network connection error updating product.');
    }
}
