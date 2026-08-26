/* 
  ================================================================
  ORCHARD E-COMMERCE PLATFORM - CART PAGE LOGIC
  Handles: Quantity Stepper, Item Deletion, Coupon Code, Checkout Modal
  ================================================================
*/

let appliedDiscount = 0;

function renderCart() {
  const tableBody = document.getElementById('cart-table-body');
  const emptyState = document.getElementById('cart-empty-state');
  const layoutContainer = document.getElementById('cart-layout-container');
  
  if (!tableBody) return;

  const cart = typeof getCart === 'function' ? getCart() : [];

  if (!cart || cart.length === 0) {
    if (layoutContainer) layoutContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (layoutContainer) layoutContainer.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  const logoFallback = typeof LOGO_BASE64 !== 'undefined' ? LOGO_BASE64 : '';

  try {
    tableBody.innerHTML = cart.map(item => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      const total = price * qty;
      const fallback = item.fallbackImage || logoFallback;
      const fmtPrice = typeof formatCurrency === 'function' ? formatCurrency(price) : '₹' + price;
      const fmtTotal = typeof formatCurrency === 'function' ? formatCurrency(total) : '₹' + total;

      return `
        <tr>
          <td>
            <div class="cart-item-info">
              <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.src='${fallback}';" />
              <div>
                <div class="cart-item-title">${item.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${fmtPrice} each</div>
              </div>
            </div>
          </td>
          <td>${fmtPrice}</td>
          <td>
            <div class="qty-control">
              <button class="qty-btn" onclick="updateItemQty('${item.id}', ${qty - 1})">-</button>
              <span class="qty-value">${qty}</span>
              <button class="qty-btn" onclick="updateItemQty('${item.id}', ${qty + 1})">+</button>
            </div>
          </td>
          <td style="font-weight: 700; color: var(--primary-dark);">
            ${fmtTotal}
          </td>
          <td style="text-align: right;">
            <button class="remove-btn" onclick="removeItem('${item.id}')" title="Remove item">
              🗑️
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Error rendering cart table:', err);
  }

  updateOrderTotals();
}

function updateItemQty(productId, newQty) {
  let cart = getCart();
  if (newQty <= 0) {
    cart = cart.filter(item => item.id !== productId);
  } else {
    const item = cart.find(item => item.id === productId);
    if (item) item.quantity = newQty;
  }
  saveCart(cart);
  renderCart();
}

function removeItem(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  if (typeof showToast === 'function') showToast('Item removed from cart', 'danger');
}

function updateOrderTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + (price * qty);
  }, 0);

  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const fmtSub = typeof formatCurrency === 'function' ? formatCurrency(subtotal) : '₹' + subtotal;
  const fmtShip = shipping === 0 ? 'FREE' : (typeof formatCurrency === 'function' ? formatCurrency(shipping) : '₹' + shipping);
  const fmtDisc = '- ' + (typeof formatCurrency === 'function' ? formatCurrency(discountAmount) : '₹' + discountAmount);
  const fmtGrand = typeof formatCurrency === 'function' ? formatCurrency(grandTotal) : '₹' + grandTotal;

  if (document.getElementById('cart-subtotal')) document.getElementById('cart-subtotal').textContent = fmtSub;
  if (document.getElementById('cart-shipping')) document.getElementById('cart-shipping').textContent = fmtShip;
  if (document.getElementById('cart-discount')) document.getElementById('cart-discount').textContent = fmtDisc;
  if (document.getElementById('cart-grand-total')) document.getElementById('cart-grand-total').textContent = fmtGrand;
}

// Promo Code Apply
function applyCoupon() {
  const couponInput = document.getElementById('coupon-input');
  if (!couponInput) return;

  const code = couponInput.value.trim().toUpperCase();
  if (code === 'WELCOME10') {
    appliedDiscount = 10;
    if (typeof showToast === 'function') showToast('Promo code WELCOME10 applied! 10% OFF 🎉', 'success');
  } else if (code === 'ORCHARD20') {
    appliedDiscount = 20;
    if (typeof showToast === 'function') showToast('Promo code ORCHARD20 applied! 20% OFF 🌟', 'success');
  } else {
    if (typeof showToast === 'function') showToast('Invalid promo code. Try WELCOME10', 'danger');
  }

  updateOrderTotals();
}

// Modal Control for Checkout
function openCheckoutModal() {
  const cart = getCart();
  if (cart.length === 0) {
    if (typeof showToast === 'function') showToast('Your cart is empty!', 'danger');
    return;
  }
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('active');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
}

function handleCheckoutSubmit(e) {
  if (e) e.preventDefault();
  
  saveCart([]);
  closeCheckoutModal();
  renderCart();
  
  if (typeof showToast === 'function') showToast('🎉 Order placed successfully! Thank you for choosing Orchard.', 'success');
}

function initCartApp() {
  renderCart();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCartApp);
} else {
  initCartApp();
}
