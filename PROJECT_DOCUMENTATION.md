# 🍏 ORCHARD E-COMMERCE PLATFORM
## Comprehensive Project Documentation & Technical Report
**Degree/Course**: Bachelor of Computer Applications (BCA) — 5th Semester Project  
**Project Name**: Orchard E-Commerce Platform  
**Technology Stack**: HTML5, CSS3, Vanilla JavaScript (ES6+), Web Storage API (`LocalStorage` & `SessionStorage`)  
**Deployment**: Static Web Server / Vercel / Hostinger / GitHub Pages  

---

## 1. Executive Summary

### 1.1 Project Overview
**Orchard** is a modern, responsive, and minimalist e-commerce web application specifically designed for selling high-altitude fresh apples, clonal rootstocks, apple nursery saplings, and orchard pruning accessories. The application delivers a high-end commercial experience using pure client-side web technologies—**HTML5, CSS3, and Vanilla JavaScript**—without relying on external backend frameworks or databases.

### 1.2 Core Objectives
- **Zero Backend Dependency**: Utilize browser-native `LocalStorage` and `SessionStorage` APIs for complete data persistence (products catalog, shopping cart, customer messages, admin credentials).
- **High Aesthetic Appeal**: Implement a custom nature-inspired emerald green design system (`#0C3B2E`, `#10B981`, `#ECFDF5`) with glassmorphism, micro-interactions, floating animations, and scroll-triggered reveal effects.
- **Admin Management Suite**: Provide a hidden, secure administrative dashboard (`/admin.html`) enabling catalog managers to perform full CRUD operations (Create, Read, Update, Delete) on products and inspect submitted customer inquiries.
- **Academic Standard**: Clean, modular, well-commented code ideal for college evaluation and project viva defense.

---

## 2. Technology Stack & Specifications

| Layer | Technology | Usage / Purpose |
| :--- | :--- | :--- |
| **Markup** | HTML5 | Semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) |
| **Styling** | CSS3 (Vanilla) | CSS Variables, Flexbox, CSS Grid, Glassmorphism, Responsive Breakpoints |
| **Scripting** | JavaScript (ES6+) | DOM Manipulation, Event Listeners, State Management, Toast System |
| **Storage Engine** | Web Storage API | `localStorage` (Product Catalog, Cart Items, Messages), `sessionStorage` (Admin Auth) |
| **Animations** | CSS Keyframes & IntersectionObserver | Floating Hero Element, Scroll Reveal Animations, Card Elevation, Button Ripple |
| **Assets** | Custom Vector Graphics & Unsplash API | Transparent Brand Logo, Favicon, High-Definition Product Imagery |

---

## 3. Architecture & File Organization Matrix

```text
Orchard/
├── index.html              # Home Page (Hero, Highlights, Featured Harvest)
├── products.html           # Catalog Page (Filters, Search, Product Cards)
├── cart.html               # Shopping Cart (Qty Stepper, Coupons, Checkout Modal)
├── contact.html            # Contact Page (Nursery Details & Inquiry Form)
├── admin.html              # Hidden Admin Suite (Auth, Product CRUD, Message Inbox)
├── project_report.html     # Printable HTML Project Report (Exportable to PDF)
├── PROJECT_DOCUMENTATION.md# Complete Technical Specification File
├── favicon.ico             # Browser Favicon Icon
├── css/
│   └── style.css           # Global Design System, Tokens, Components & Responsive Rules
├── js/
│   ├── main.js             # Core LocalStorage Initializer, Cart Badge Sync, Scroll Observer
│   ├── products.js         # Dynamic Catalog Render, Search & Category Filter Logic
│   ├── cart.js             # Cart Table Management, Stepper, Promo Discounts & Checkout
│   ├── contact.js          # Contact Form Validation & Message Storage Engine
│   └── admin.js            # Admin Authentication, Modal Forms & Product CRUD Handlers
└── images/
    ├── logo.png            # Master Brand Image
    └── logo_transparent.png# Autocropped High-Res Transparent Brand Logo
```

---

## 4. Key Functional Modules Breakdown

### 4.1 Storefront Navigation & Header
- **Top Announcement Bar**: Displays promotional offer banner (*Pre-Orders Open, Code: WELCOME10*).
- **Navigation Bar**: Features the custom transparent apple brand logo, responsive navigation links (*Home, Products, Cart, Contact*), active page indicator, and mobile drawer toggle button (`☰`).
- **Dynamic Cart Counter Badge**: Synchronizes real-time cart item quantities across all pages via `updateCartBadge()`.

### 4.2 Home Page (`index.html`)
- **Hero Showcase**: High-impact banner featuring gradient typography, action buttons, and an animated floating hero product card (`animation: float 4s ease-in-out infinite`).
- **Orchard Difference (Bento Highlights Grid)**: Four elevated glass cards showcasing key business advantages:
  1. *High-Altitude Grown* (01 / ELEVATION)
  2. *Cold-Chain Express* (02 / LOGISTICS)
  3. *Virus-Indexed Stocks* (03 / CERTIFIED)
  4. *100% Growth Guarantee* (04 / GUARANTEE)
- **Featured Harvest Showcase**: Automatically renders catalog products from `localStorage`.

### 4.3 Products Catalog (`products.html`)
- **Category Filter Pills**: Filter items instantly by category (*All Products, Fresh Apples, Apple Saplings, Rootstocks, Accessories*).
- **Live Search Bar**: Filters product cards in real time as the user types keywords matching product titles or descriptions.
- **Image Fallback System**: Implements `onerror` fallback handling to prevent broken image displays.

### 4.4 Shopping Cart & Checkout (`cart.html`)
- **Cart Table**: Displays item thumbnail, name, unit price, quantity stepper (`+` / `-`), line total, and single-click deletion.
- **Empty Cart State**: Shows custom graphic and call-to-action button when cart is empty.
- **Promo Coupon Engine**:
  - `WELCOME10`: Applies 10% discount on order subtotal.
  - `ORCHARD20`: Applies 20% discount on order subtotal.
- **Checkout Modal**: Collects customer full name, phone number, shipping address, and payment method (*Cash on Delivery / UPI NetBanking*), triggering order placement simulation and clearing the active cart.

### 4.5 Contact & Inquiry Page (`contact.html`)
- **Nursery HQ Information**: Displays location address, phone support numbers, and email contact cards.
- **Inquiry Form**: Accepts Name, Email, Phone, Subject, and Message text. Upon submission, constructs a message object with timestamp and saves it to `localStorage.getItem('orchard_messages')`.

### 4.6 Hidden Admin Suite (`admin.html`)
- **Hidden Route Protection**: Omitted from standard navbar links. Accessible strictly by navigating to `/admin.html`.
- **Authentication Gateway**:
  - *Default Username*: `admin`
  - *Default Password*: `admin123`
  - Stores session state in `sessionStorage.getItem('orchard_admin_logged')`.
- **Admin Dashboard Tabs**:
  1. **Product Inventory & Catalog**: View product table, launch **Add Product Modal**, launch **Edit Product Modal**, or delete products with confirmation.
  2. **Customer Messages Inbox**: Displays submitted contact inquiries saved from `contact.html` with timestamps and sender details.
  3. **Live Stats Counters**: Displays total catalog count and total message count.

---

## 5. LocalStorage Data Schema Specifications

### 5.1 Product Schema (`orchard_products`)
```json
[
  {
    "id": "prod-1",
    "name": "Kullu Royal Honeycrisp",
    "category": "fresh-apples",
    "categoryName": "Fresh Apples",
    "price": 399,
    "originalPrice": 499,
    "stock": 120,
    "badge": "Best Seller",
    "rating": 4.9,
    "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    "description": "Ultra-crisp high-altitude Honeycrisp harvested in Kullu Valley."
  }
]
```

### 5.2 Cart Item Schema (`orchard_cart`)
```json
[
  {
    "id": "prod-1",
    "name": "Kullu Royal Honeycrisp",
    "price": 399,
    "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    "quantity": 2
  }
]
```

### 5.3 Contact Message Schema (`orchard_messages`)
```json
[
  {
    "id": "msg-1785935400000",
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "phone": "+91 98765 43210",
    "subject": "Bulk Sapling Order",
    "message": "Interested in ordering 500 pcs M9 T337 rootstocks for winter planting.",
    "date": "05 Aug 2026, 07:30 PM"
  }
]
```

---

## 6. Design System & CSS Architecture

### 6.1 Design Tokens (`:root`)
```css
:root {
  --primary-dark: #0c3b2e;      /* Deep Forest Emerald */
  --primary: #10b981;           /* Vibrant Leaf Green */
  --primary-light: #6ee7b7;     /* Soft Mint */
  --primary-bg: #ecfdf5;        /* Light Mint Tint */
  --accent-gold: #d4af37;       /* Harvest Gold */
  --bg-main: #f8fafc;           /* Light Canvas */
  --bg-card: #ffffff;           /* Clean Card White */
  --text-main: #0f172a;         /* Deep Slate */
  --text-muted: #64748b;       /* Muted Text */
  --border-color: #e2e8f0;     /* Border Divider */
}
```

### 6.2 Scroll Reveal Engine
Implements `IntersectionObserver` in `js/main.js` targeting `.reveal`, `.reveal-left`, `.reveal-right`, and `.reveal-scale` elements with cubic-bezier transition curves:
```css
.reveal {
  opacity: 0;
  transform: translateY(35px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal.reveal-active {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 7. Deployment Instructions

### 7.1 Vercel Static Deployment
1. Connect GitHub repository `Joyboycoffee/Orchard` to Vercel.
2. In Vercel Project Settings -> **General**:
   - Set **Framework Preset** to **`Other`**.
3. Under **Build & Development Settings**:
   - Set **Build Command** to **`OVERRIDE`** (leave text box **EMPTY**).
   - Set **Output Directory** to **`OVERRIDE`** (leave text box **EMPTY**).
4. Click **Save** and trigger **Redeploy**. Vercel will publish the site in ~2 seconds.

---

## 8. Conclusion
The **Orchard E-Commerce Platform** successfully demonstrates how advanced client-side web development techniques—leveraging semantic HTML5, CSS custom properties, asynchronous DOM events, and Web Storage APIs—can deliver a complete, highly engaging e-commerce experience suitable for academic evaluation and production static web hosting.
