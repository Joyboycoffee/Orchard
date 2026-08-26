/* 
  ================================================================
  ORCHARD E-COMMERCE PLATFORM - ADMIN PANEL LOGIC
  Handles: Admin Login Auth, Product CRUD, Orders Management, Message Inbox
  ================================================================
*/

let editingProductId = null;

// Auth Verification
function checkAdminAuth() {
  const isLoggedIn = (localStorage.getItem('orchard_admin_logged') === 'true' || sessionStorage.getItem('orchard_admin_logged') === 'true');
  const loginSection = document.getElementById('admin-login-section');
  const dashboardSection = document.getElementById('admin-dashboard-section');

  if (isLoggedIn) {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    renderAdminProducts();
    renderAdminOrders();
    renderAdminMessages();
    switchAdminTab('products');
  } else {
    if (loginSection) loginSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';
  }
}

function handleAdminLogin(e) {
  if (e) e.preventDefault();
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');

  const username = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('orchard_admin_logged', 'true');
    sessionStorage.setItem('orchard_admin_logged', 'true');
    if (typeof showToast === 'function') showToast('Welcome back, Admin! 🛡️', 'success');
    checkAdminAuth();
  } else {
    if (typeof showToast === 'function') showToast('Invalid Username or Password! (Hint: admin / admin123)', 'danger');
  }
}

function handleAdminLogout() {
  localStorage.removeItem('orchard_admin_logged');
  sessionStorage.removeItem('orchard_admin_logged');
  if (typeof showToast === 'function') showToast('Logged out of Admin Portal', 'success');
  checkAdminAuth();
}

// Render Admin Products Table
function renderAdminProducts() {
  const tableBody = document.getElementById('admin-products-table-body');
  if (!tableBody) return;

  const products = typeof getProducts === 'function' ? getProducts() : [];
  const logoFallback = typeof LOGO_BASE64 !== 'undefined' ? LOGO_BASE64 : '';

  tableBody.innerHTML = products.map(product => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${product.image}" alt="${product.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;" onerror="this.onerror=null; this.src='${product.fallbackImage || logoFallback}';" />
          <div>
            <div style="font-weight: 700; color: var(--primary-dark);">${product.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${product.categoryName || product.category}</div>
          </div>
        </div>
      </td>
      <td>${typeof formatCurrency === 'function' ? formatCurrency(product.price) : '₹' + product.price}</td>
      <td>${product.originalPrice ? (typeof formatCurrency === 'function' ? formatCurrency(product.originalPrice) : '₹' + product.originalPrice) : '-'}</td>
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

  const statEl = document.getElementById('stat-total-products');
  if (statEl) statEl.textContent = products.length;
}

// Render Placed Orders in Admin Panel
function renderAdminOrders() {
  const container = document.getElementById('admin-orders-container');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('orchard_orders')) || [];
  const statOrdersEl = document.getElementById('stat-total-orders');
  if (statOrdersEl) statOrdersEl.textContent = orders.length;

  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3.5rem 1rem; background: #ffffff; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="font-size: 3rem; margin-bottom: 0.75rem;">🛍️</div>
        <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-dark);">No Customer Orders Yet</h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">Orders submitted during checkout on cart.html will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const itemsListHtml = (order.items || []).map(item => `
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.3rem 0; border-bottom: 1px dashed var(--border-color);">
        <span>${item.name} × <strong>${item.quantity || 1}</strong></span>
        <span style="font-weight: 700; color: var(--primary-dark);">${typeof formatCurrency === 'function' ? formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 1)) : '₹' + ((item.price || 0) * (item.quantity || 1))}</span>
      </div>
    `).join('');

    const isCompleted = order.status === 'Completed';
    const statusBg = isCompleted ? '#ecfdf5' : '#fffbebe6';
    const statusColor = isCompleted ? '#10b981' : '#b45309';

    return `
      <div style="background: #ffffff; padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--primary-dark);">Order #${order.id}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${order.date}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="padding: 0.3rem 0.8rem; border-radius: 99px; font-weight: 700; font-size: 0.8rem; background: ${statusBg}; color: ${statusColor};">
              ● ${order.status || 'Pending'}
            </span>
            <button onclick="toggleOrderStatus('${order.id}')" style="background: var(--primary-bg); color: var(--primary-dark); padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem;">
              🔄 Change Status
            </button>
            <button onclick="deleteOrder('${order.id}')" style="background: #fee2e2; color: #ef4444; padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 700; font-size: 0.8rem;">
              🗑️ Cancel
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1rem; background: var(--bg-main); padding: 1rem; border-radius: var(--radius-sm);">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Customer Details</div>
            <div style="font-weight: 700; color: var(--primary-dark); margin-top: 0.2rem;">${order.customerName}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">📞 ${order.phone}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">📍 ${order.address}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Payment Info</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); margin-top: 0.2rem;">${order.paymentMethod}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Shipping: ${order.shipping === 0 ? 'FREE' : (typeof formatCurrency === 'function' ? formatCurrency(order.shipping) : '₹' + order.shipping)}</div>
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem;">Ordered Items</div>
          ${itemsListHtml}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem; font-weight: 800;">
          <span style="color: var(--primary-dark);">Total Order Amount:</span>
          <span style="font-size: 1.2rem; color: var(--primary);">${typeof formatCurrency === 'function' ? formatCurrency(order.totalAmount) : '₹' + order.totalAmount}</span>
        </div>
      </div>
    `;
  }).join('');
}

function toggleOrderStatus(orderId) {
  let orders = JSON.parse(localStorage.getItem('orchard_orders')) || [];
  orders = orders.map(order => {
    if (order.id === orderId) {
      const newStatus = order.status === 'Completed' ? 'Pending' : 'Completed';
      return { ...order, status: newStatus };
    }
    return order;
  });
  localStorage.setItem('orchard_orders', JSON.stringify(orders));
  renderAdminOrders();
  if (typeof showToast === 'function') showToast('Order status updated!', 'success');
}

function deleteOrder(orderId) {
  if (!confirm('Are you sure you want to delete/cancel this order?')) return;
  let orders = JSON.parse(localStorage.getItem('orchard_orders')) || [];
  orders = orders.filter(o => o.id !== orderId);
  localStorage.setItem('orchard_orders', JSON.stringify(orders));
  renderAdminOrders();
  if (typeof showToast === 'function') showToast('Order removed from panel', 'danger');
}

// Render Submitted Contact Messages
function renderAdminMessages() {
  const container = document.getElementById('admin-messages-container');
  if (!container) return;

  const messages = JSON.parse(localStorage.getItem('orchard_messages')) || [];
  const statEl = document.getElementById('stat-total-messages');
  if (statEl) statEl.textContent = messages.length;

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
  const titleEl = document.getElementById('product-modal-title');
  if (titleEl) titleEl.textContent = 'Add New Product';
  const formEl = document.getElementById('product-form');
  if (formEl) formEl.reset();
  const modalEl = document.getElementById('product-modal');
  if (modalEl) modalEl.classList.add('active');
}

function openEditProductModal(productId) {
  const products = typeof getProducts === 'function' ? getProducts() : [];
  const product = products.find(p => p.id === productId);
  if (!product) return;

  editingProductId = productId;
  const titleEl = document.getElementById('product-modal-title');
  if (titleEl) titleEl.textContent = 'Edit Product Details';
  
  if (document.getElementById('prod-name')) document.getElementById('prod-name').value = product.name;
  if (document.getElementById('prod-category')) document.getElementById('prod-category').value = product.category;
  if (document.getElementById('prod-price')) document.getElementById('prod-price').value = product.price;
  if (document.getElementById('prod-original-price')) document.getElementById('prod-original-price').value = product.originalPrice || '';
  if (document.getElementById('prod-stock')) document.getElementById('prod-stock').value = product.stock;
  if (document.getElementById('prod-badge')) document.getElementById('prod-badge').value = product.badge || '';
  if (document.getElementById('prod-image')) document.getElementById('prod-image').value = product.image;
  if (document.getElementById('prod-description')) document.getElementById('prod-description').value = product.description;

  const modalEl = document.getElementById('product-modal');
  if (modalEl) modalEl.classList.add('active');
}

function closeProductModal() {
  const modalEl = document.getElementById('product-modal');
  if (modalEl) modalEl.classList.remove('active');
}

function handleProductFormSubmit(e) {
  if (e) e.preventDefault();

  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const price = Number(document.getElementById('prod-price').value);
  const originalPrice = document.getElementById('prod-original-price').value ? Number(document.getElementById('prod-original-price').value) : null;
  const stock = Number(document.getElementById('prod-stock').value);
  const badge = document.getElementById('prod-badge').value.trim();
  const image = document.getElementById('prod-image').value.trim() || 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20600%20600%27%3E%3Crect%20width%3D%27600%27%20height%3D%27600%27%20rx%3D%2730%27%20fill%3D%27%23ECFDF5%27/%3E%3Ccircle%20cx%3D%27300%27%20cy%3D%27330%27%20r%3D%27180%27%20fill%3D%27%23EF4444%27/%3E%3Ctext%20x%3D%27300%27%20y%3D%27550%27%20font-size%3D%2732%27%20font-family%3D%27sans-serif%27%20font-weight%3D%27800%27%20fill%3D%27%230C3B2E%27%20text-anchor%3D%27middle%27%3EOrchard%20Produce%3C/text%3E%3C/svg%3E';
  const description = document.getElementById('prod-description').value.trim();

  const categoryNames = {
    'fresh-apples': 'Fresh Apples',
    'apple-trees': 'Apple Saplings',
    'rootstocks': 'Rootstocks',
    'accessories': 'Accessories'
  };

  let products = typeof getProducts === 'function' ? getProducts() : [];

  if (editingProductId) {
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
    if (typeof showToast === 'function') showToast('Product updated successfully! ✏️', 'success');
  } else {
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
    if (typeof showToast === 'function') showToast('New product added to catalog! 🍏', 'success');
  }

  saveProducts(products);
  closeProductModal();
  renderAdminProducts();
}

function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  let products = typeof getProducts === 'function' ? getProducts() : [];
  products = products.filter(p => p.id !== productId);
  saveProducts(products);
  renderAdminProducts();
  if (typeof showToast === 'function') showToast('Product deleted from catalog', 'danger');
}

// Tab Switching
function switchAdminTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.borderBottom = 'none';
    btn.style.color = 'var(--text-muted)';
  });
  document.querySelectorAll('.admin-tab-content').forEach(content => content.style.display = 'none');

  const activeBtn = document.getElementById(`tab-btn-${tabName}`);
  const activeContent = document.getElementById(`admin-tab-${tabName}`);

  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.borderBottom = '3px solid var(--primary-dark)';
    activeBtn.style.color = 'var(--primary-dark)';
  }
  if (activeContent) activeContent.style.display = 'block';
}

function initAdminApp() {
  checkAdminAuth();

  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin);
  }

  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', handleProductFormSubmit);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminApp);
} else {
  initAdminApp();
}