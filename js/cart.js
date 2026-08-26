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

  const cart = getCart();

  if (cart.length === 0) {
    if (layoutContainer) layoutContainer.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (layoutContainer) layoutContainer.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';

  tableBody.innerHTML = cart.map(item => `
    <tr>
      <td>
        <div class="cart-item-info">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.src='${item.fallbackImage || LOGO_BASE64}';" />
          <div>
            <div class="cart-item-title">${item.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${formatCurrency(item.price)} each</div>
          </div>
        </div>
      </td>
      <td>${formatCurrency(item.price)}</td>
      <td>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateItemQty('${item.id}', ${item.quantity - 1})">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateItemQty('${item.id}', ${item.quantity + 1})">+</button>
        </div>
      </td>
      <td style="font-weight: 700; color: var(--primary-dark);">
        ${formatCurrency(item.price * item.quantity)}
      </td>
      <td style="text-align: right;">
        <button class="remove-btn" onclick="removeItem('${item.id}')" title="Remove item">
          🗑️
        </button>
      </td>
    </tr>
  `).join('');

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
  showToast('Item removed from cart', 'danger');
}

function updateOrderTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 150;
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('cart-shipping').textContent = shipping === 0 ? 'FREE' : formatCurrency(shipping);
  document.getElementById('cart-discount').textContent = `- ${formatCurrency(discountAmount)}`;
  document.getElementById('cart-grand-total').textContent = formatCurrency(grandTotal);
}

// Promo Code Apply
function applyCoupon() {
  const couponInput = document.getElementById('coupon-input');
  if (!couponInput) return;

  const code = couponInput.value.trim().toUpperCase();
  if (code === 'WELCOME10') {
    appliedDiscount = 10;
    showToast('Promo code WELCOME10 applied! 10% OFF 🎉', 'success');
  } else if (code === 'ORCHARD20') {
    appliedDiscount = 20;
    showToast('Promo code ORCHARD20 applied! 20% OFF 🌟', 'success');
  } else {
    showToast('Invalid promo code. Try WELCOME10', 'danger');
  }

  updateOrderTotals();
}

// Modal Control for Checkout
function openCheckoutModal() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'danger');
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
  e.preventDefault();
  
  // Clear Cart after successful order simulation
  saveCart([]);
  closeCheckoutModal();
  renderCart();
  
  showToast('🎉 Order placed successfully! Thank you for choosing Orchard.', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});
