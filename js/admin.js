/* 
  ================================================================
  ORCHARD E-COMMERCE PLATFORM - ADMIN PANEL LOGIC
  Handles: Admin Login Auth, Product CRUD, Message Inbox in LocalStorage
  ================================================================
*/

let editingProductId = null;

// Auth Verification
function checkAdminAuth() {
  const isLoggedIn = sessionStorage.getItem('orchard_admin_logged') === 'true';
  const loginSection = document.getElementById('admin-login-section');
  const dashboardSection = document.getElementById('admin-dashboard-section');

  if (isLoggedIn) {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    renderAdminProducts();
    renderAdminMessages();
  } else {
    if (loginSection) loginSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');

  if (usernameInput.value === 'admin' && passwordInput.value === 'admin123') {
    sessionStorage.setItem('orchard_admin_logged', 'true');
    showToast('Welcome back, Admin! 🛡️', 'success');
    checkAdminAuth();
  } else {
    showToast('Invalid Username or Password! (Hint: admin / admin123)', 'danger');
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem('orchard_admin_logged');
  showToast('Logged out of Admin Portal', 'success');
  checkAdminAuth();
}

// Render Admin Products Table
function renderAdminProducts() {
  const tableBody = document.getElementById('admin-products-table-body');
  if (!tableBody) return;

  const products = getProducts();

  tableBody.innerHTML = products.map(product => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${product.image}" alt="${product.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" />
          <div>
            <div style="font-weight: 700; color: var(--primary-dark);">${product.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${product.categoryName || product.category}</div>
          </div>
        </div>
      </td>
      <td>${formatCurrency(product.price)}</td>
      <td>${product.originalPrice ? formatCurrency(product.originalPrice) : '-'}</td>
      <td>
        <span style="padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 700; font-size: 0.75rem; background: ${product.stock > 20 ? '#ecfdf5' : '#fee2e2'}; color: ${product.stock > 20 ? '#10b981' : '#ef4444'};">
          ${product.stock} units
        </span>
      </td>
      <td style="text-align: right;">
        <button onclick="openEditProductModal('${product.id}')" style="background: var(--primary-bg); color: var(--primary-dark); padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem; margin-right: 0.4rem;">
          ✏️ Edit
        </button>
        <button onclick="deleteProduct('${product.id}')" style="background: #fee2e2; color: #ef4444; padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem;">
          🗑️ Delete
        </button>
      </td>
    </tr>
  `).join('');

  // Update Stats Counters
  document.getElementById('stat-total-products').textContent = products.length;
}

// Render Submitted Contact Messages
function renderAdminMessages() {
  const container = document.getElementById('admin-messages-container');
  if (!container) return;

  const messages = JSON.parse(localStorage.getItem('orchard_messages')) || [];

  document.getElementById('stat-total-messages').textContent = messages.length;

  if (messages.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: #ffffff; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📥</div>
        <h4 style="font-weight: 700; color: var(--primary-dark);">No Messages Received Yet</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Messages submitted on contact.html will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = messages.map(msg => `
    <div style="background: #ffffff; padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
        <div>
          <h4 style="font-weight: 700; color: var(--primary-dark); font-size: 1.05rem;">${msg.name}</h4>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${msg.email} ${msg.phone ? '• ' + msg.phone : ''}</div>
        </div>
        <span style="font-size: 0.75rem; color: var(--text-muted); background: var(--bg-main); padding: 0.2rem 0.6rem; border-radius: 12px; border: 1px solid var(--border-color);">${msg.date}</span>
      </div>
      <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary); margin-bottom: 0.4rem;">Subject: ${msg.subject}</div>
      <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5;">${msg.message}</p>
    </div>
  `).join('');
}

// Product CRUD Handlers
function openAddProductModal() {
  editingProductId = null;
  document.getElementById('product-modal-title').textContent = 'Add New Product';
  document.getElementById('product-form').reset();
  document.getElementById('product-modal').classList.add('active');
}

function openEditProductModal(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  editingProductId = productId;
  document.getElementById('product-modal-title').textContent = 'Edit Product Details';
  
  document.getElementById('prod-name').value = product.name;
  document.getElementById('prod-category').value = product.category;
  document.getElementById('prod-price').value = product.price;
  document.getElementById('prod-original-price').value = product.originalPrice || '';
  document.getElementById('prod-stock').value = product.stock;
  document.getElementById('prod-badge').value = product.badge || '';
  document.getElementById('prod-image').value = product.image;
  document.getElementById('prod-description').value = product.description;

  document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

function handleProductFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const price = Number(document.getElementById('prod-price').value);
  const originalPrice = document.getElementById('prod-original-price').value ? Number(document.getElementById('prod-original-price').value) : null;
  const stock = Number(document.getElementById('prod-stock').value);
  const badge = document.getElementById('prod-badge').value.trim();
  const image = document.getElementById('prod-image').value.trim() || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80';
  const description = document.getElementById('prod-description').value.trim();

  const categoryNames = {
    'fresh-apples': 'Fresh Apples',
    'apple-trees': 'Apple Saplings',
    'rootstocks': 'Rootstocks',
    'accessories': 'Accessories'
  };

  let products = getProducts();

  if (editingProductId) {
    // Edit existing product
    products = products.map(p => {
      if (p.id === editingProductId) {
        return {
          ...p,
          name,
          category,
          categoryName: categoryNames[category] || 'Produce',
          price,
          originalPrice,
          stock,
          badge,
          image,
          description
        };
      }
      return p;
    });
    showToast('Product updated successfully! ✏️', 'success');
  } else {
    // Add new product
    const newProduct = {
      id: 'prod-' + Date.now(),
      name,
      category,
      categoryName: categoryNames[category] || 'Produce',
      price,
      originalPrice,
      stock,
      badge,
      rating: 5.0,
      image,
      description
    };
    products.unshift(newProduct);
    showToast('New product added to catalog! 🍏', 'success');
  }

  saveProducts(products);
  closeProductModal();
  renderAdminProducts();
}

function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  let products = getProducts();
  products = products.filter(p => p.id !== productId);
  saveProducts(products);
  renderAdminProducts();
  showToast('Product deleted from catalog', 'danger');
}

// Tab Switching
function switchAdminTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(content => content.style.display = 'none');

  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  const activeContent = document.getElementById(`admin-tab-${tabName}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activeContent) activeContent.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();

  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin);
  }

  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', handleProductFormSubmit);
  }
});
