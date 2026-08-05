/* 
  ================================================================
  ORCHARD E-COMMERCE PLATFORM - MAIN JAVASCRIPT MODULE
  College Project: BCA 5th Semester
  Handles: LocalStorage Initialization, Cart Sync, UI Toasts & Nav
  ================================================================
*/

// Default Product Catalog Data (Seeded into LocalStorage if empty)
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Kullu Royal Honeycrisp",
    category: "fresh-apples",
    categoryName: "Fresh Apples",
    price: 399,
    originalPrice: 499,
    stock: 120,
    badge: "Best Seller",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    description: "Ultra-crisp high-altitude Honeycrisp harvested in Kullu Valley. Exploding juice cells with sweet-tart balance."
  },
  {
    id: "prod-2",
    name: "Himalayan Fuji Supreme",
    category: "fresh-apples",
    categoryName: "Fresh Apples",
    price: 449,
    originalPrice: 549,
    stock: 95,
    badge: "Premium",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
    description: "Intense honey sweetness, extra dense crunch, hand-picked from 7,500 ft elevation orchards."
  },
  {
    id: "prod-3",
    name: "Organic Royal Gala Crimson",
    category: "fresh-apples",
    categoryName: "Fresh Apples",
    price: 349,
    originalPrice: 429,
    stock: 200,
    badge: "100% Organic",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=600&q=80",
    description: "Delicate floral aroma, crisp skin, pesticide-free apples ideal for fresh daily snacking."
  },
  {
    id: "prod-4",
    name: "High-Altitude Pink Lady",
    category: "fresh-apples",
    categoryName: "Fresh Apples",
    price: 489,
    originalPrice: 599,
    stock: 75,
    badge: "Seasonal",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1576179635662-9d1983e97e1e?auto=format&fit=crop&w=600&q=80",
    description: "Distinct pink blush with a tangy fizzy crunch ripened under 200+ days of mountain sunshine."
  },
  {
    id: "prod-5",
    name: "Buckeye Gala Sapling (M9 T337)",
    category: "apple-trees",
    categoryName: "Apple Saplings",
    price: 380,
    originalPrice: 450,
    stock: 350,
    badge: "Feathered Tree",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    description: "2-Year Knip-boom feathered apple tree grafted on dwarfing M9 T337 for high-density planting."
  },
  {
    id: "prod-6",
    name: "Jeromine Red Spur Tree (MM106)",
    category: "apple-trees",
    categoryName: "Apple Saplings",
    price: 399,
    originalPrice: 480,
    stock: 180,
    badge: "Spur Type",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&w=600&q=80",
    description: "Produces 100% full dark crimson fruit even on interior spurs. Strong semi-dwarf MM106 roots."
  },
  {
    id: "prod-7",
    name: "M9 T337 Clonal Rootstock (10 Pcs)",
    category: "rootstocks",
    categoryName: "Rootstocks",
    price: 999,
    originalPrice: 1200,
    stock: 500,
    badge: "Dutch Clonal",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
    description: "Grade-1 virus-free dwarfing rootstock liners for winter bench grafting and orchard establishment."
  },
  {
    id: "prod-8",
    name: "Japanese SK5 Pruning Secateurs",
    category: "accessories",
    categoryName: "Accessories",
    price: 1499,
    originalPrice: 1899,
    stock: 60,
    badge: "Orchard Tool",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=600&q=80",
    description: "Razor-sharp Japanese high-carbon SK5 steel blades for clean precision pruning up to 25mm."
  }
];

// Initialize LocalStorage Data on Load
function initLocalStorage() {
  const currentVer = localStorage.getItem('orchard_products_version');
  if (!currentVer || currentVer !== 'v2' || !localStorage.getItem('orchard_products')) {
    localStorage.setItem('orchard_products', JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem('orchard_products_version', 'v2');
  }
  if (!localStorage.getItem('orchard_cart')) {
    localStorage.setItem('orchard_cart', JSON.stringify([]));
  }
  if (!localStorage.getItem('orchard_messages')) {
    localStorage.setItem('orchard_messages', JSON.stringify([]));
  }
}

// Getters & Setters
function getProducts() {
  initLocalStorage();
  return JSON.parse(localStorage.getItem('orchard_products')) || [];
}

function saveProducts(products) {
  localStorage.setItem('orchard_products', JSON.stringify(products));
}

function getCart() {
  initLocalStorage();
  return JSON.parse(localStorage.getItem('orchard_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('orchard_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badgeEls = document.querySelectorAll('.cart-badge');
  badgeEls.forEach(el => {
    el.textContent = totalCount;
  });
}

// Add Item To Cart
function addToCart(productId, quantity = 1) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    showToast('Product not found!', 'danger');
    return;
  }

  let cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" to cart! 🛒`, 'success');
}

// Currency Formatter
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Custom Toast Notification System
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '⚠️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// DOM Loaded Event Handlers
document.addEventListener('DOMContentLoaded', () => {
  initLocalStorage();
  updateCartBadge();

  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Active Nav Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
