/* 
  ================================================================
  ORCHARD E-COMMERCE PLATFORM - PRODUCTS PAGE LOGIC
  Handles: Dynamic Catalog Rendering, Category Filtering, Search
  ================================================================
*/

let currentCategory = 'all';
let searchQuery = '';

function renderProducts() {
  const container = document.getElementById('products-grid-container');
  if (!container) return;

  const products = getProducts();
  
  // Filter products by category & search query
  const filtered = products.filter(product => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🍏</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--primary-dark);">No Products Found</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Try adjusting your category filter or search keywords.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => `
    <div class="product-card">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80';" />
      </div>
      <div class="product-info">
        <span class="product-category">${product.categoryName || 'Orchard Produce'}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">${formatCurrency(product.price)}</span>
            ${product.originalPrice ? `<span class="price-original">${formatCurrency(product.originalPrice)}</span>` : ''}
          </div>
          
          <button class="add-cart-btn" onclick="addToCart('${product.id}')">
            <span>+ Add</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

  // Category Filter Pills Listener
  const pills = document.querySelectorAll('.pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category || 'all';
      renderProducts();
    });
  });

  // Search Input Listener
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderProducts();
    });
  }
});
