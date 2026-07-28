# Orchard API & Server Actions Reference

This document outlines the Server Actions and backend service contracts exposed by the application.

---

## 1. Authentication Actions (`/actions/auth.ts`)

### `registerAction(formData)`
- **Input**: `{ fullName: string, email: string, password: string, phone?: string }`
- **Output**: `{ success: boolean, message: string, data?: { user: User } }`
- **Description**: Registers a new customer account, hashes password via bcrypt, and sets HTTP-Only JWT tokens.

### `loginAction(formData)`
- **Input**: `{ email: string, password: string }`
- **Output**: `{ success: boolean, message: string, data?: { user: User } }`
- **Description**: Verifies credentials and sets `orchard_token` cookie.

### `logoutAction()`
- **Output**: `{ success: boolean, message: string }`
- **Description**: Clears JWT authentication cookies.

---

## 2. Product Catalog Actions (`/actions/products.ts`)

### `getProductsAction(params)`
- **Input**: `{ categorySlug?: string, search?: string, minPrice?: number, maxPrice?: number, sortBy?: string, page?: number, limit?: number }`
- **Output**: `{ success: boolean, data: { products: Product[], pagination: Pagination } }`

### `getProductBySlugAction(slug)`
- **Input**: `slug: string`
- **Output**: `{ success: boolean, data: ProductDetail }`

---

## 3. Cart & Wishlist Actions (`/actions/cart.ts`, `/actions/wishlist.ts`)

### `addToCartAction(productId, variantId?, quantity)`
- **Input**: `productId: string`, `variantId?: string`, `quantity: number`
- **Output**: `{ success: boolean, message: string }`

### `toggleWishlistAction(productId)`
- **Input**: `productId: string`
- **Output**: `{ success: boolean, data: { inWishlist: boolean }, message: string }`

---

## 4. Order & Checkout Actions (`/actions/orders.ts`)

### `createOrderAction(input)`
- **Input**: `{ addressId: string, paymentMethod: PaymentMethod, couponCode?: string, notes?: string }`
- **Output**: `{ success: boolean, data: Order, message: string }`
- **Description**: Validates cart, applies coupons, creates order in DB, deducts stock quantities, and clears user cart.

---

## 5. Admin Actions (`/actions/admin.ts`)

### `getAdminDashboardStatsAction()`
- **Output**: Revenue totals, order status aggregations, customer count, low stock product warnings.

### `updateOrderStatusAction(orderId, status, trackingNumber?, courierName?)`
- **Output**: Updates order status and creates Audit Log entry.
