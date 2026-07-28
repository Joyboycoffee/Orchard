# Orchard — Premium E-Commerce Platform

> **BCA Final Semester Project — Investor-Grade Startup Ready Application**

Orchard is a full-stack, enterprise-grade e-commerce application built for commercial high-density nurseries and organic apple fruit sales. Inspired by design systems from Apple, Stripe, Vercel, and Linear, Orchard integrates modern glassmorphism UI tokens, Next.js 15 App Router architecture, Prisma ORM, PostgreSQL database, and Razorpay payment processing.

---

## 🌟 Key Product Features

- **High-Density Nursery Catalog**: Specialized inventory management for 2-year Knip-boom feathered saplings, virus-indexed Dutch M9 T337, Geneva G11/G41, and MM106 rootstocks.
- **Produce Storefront**: Fresh high-altitude Kullu Valley Honeycrisp, Gala, and Fuji apples with cold-chain shipping estimations.
- **Interactive Tree Selection Matrix**: Interactive calculator matching orchard elevation, chilling hours, and irrigation availability with ideal sapling rootstocks.
- **Glassmorphism UI/UX**: Ultra-modern responsive user interface with blur backdrops (`backdrop-blur-glass`), micro-interactions via Framer Motion, and dark mode theme switching.
- **Mobile-First UX**: Dedicated bottom tab bar for smartphones, touch-optimized drawer menus, and responsive tables.
- **Enterprise Admin Suite**: Dashboard analytics (Revenue aggregation, order metrics, customer CRM, stock alerts, audit logging, and logistics tracking updates).
- **Security & Authorization**: JWT token authorization in HTTP-Only cookies, bcrypt password hashing, Zod schema validation, Helmet header protection, and role-based access control (Customer, Admin, Super Admin).

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router, Server Components, Server Actions, ISR/SSR)
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS, Radix UI primitives, Custom Glassmorphism, Lucide Icons, Next Themes
- **Database & ORM**: PostgreSQL, Prisma ORM, Redis caching
- **Payment Processing**: Razorpay API & Webhook integration
- **Email & Communications**: Nodemailer (Transactional invoices & order updates)
- **Deployment**: Docker, Nginx reverse proxy, PM2 cluster mode, Hostinger VPS deployment

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `^20.0.0`
- PostgreSQL database
- Redis instance (optional for local dev)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/orchard-bca.git
   cd orchard-bca
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Database Setup & Seeding:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

5. Run Development Server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🔑 Default Accounts (Seeded)

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `superadmin@orchard.com` | `AdminPassword123!` |
| **Admin** | `admin@orchard.com` | `AdminPassword123!` |
| **Customer** | `customer@orchard.com` | `Customer123!` |

---

## 📁 Directory Structure Overview

```
/app                # Next.js 15 App Router (Storefront & Admin pages)
/actions            # Next Server Actions (Auth, Cart, Orders, Admin, Products)
/components         # Reusable React components (UI primitives, Layout, Admin)
/config             # Site configuration & navigation schema
/docker             # Dockerfile, docker-compose.yml, Nginx proxy configs
/docs               # Architecture, Deployment, Admin & API documentation
/lib                # Core utilities (Prisma client, JWT, Password, Utils)
/prisma             # Database Schema & Seeding scripts
/styles             # HSL globals.css & Glassmorphism styles
```

---

## 📄 Final Project Documentation
Detailed documentation files available in `/docs`:
- `docs/DEPLOYMENT.md` — Hostinger VPS, Docker, SSL & Nginx setup guide.
- `docs/ADMIN_MANUAL.md` — Administrator operations manual.
- `docs/API_DOCUMENTATION.md` — Complete Server Action & REST API reference.
- `docs/ER_DIAGRAM.md` — Database ER model & schema relations.
