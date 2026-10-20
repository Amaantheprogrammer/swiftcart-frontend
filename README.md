# 🛒 SwiftCart Frontend

<div align="center">

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot Backend](https://img.shields.io/badge/Spring_Boot-3.5_Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)

A high-performance, dark-themed, responsive e-commerce web application engineered to interface with the **SwiftCart Spring Boot 3.5** multi-tier marketplace backend.

</div>

---

## ⚡ Overview & Features

- **🛍️ Complete Marketplace Catalog:**
  - Dynamic category filters (`/categories`)
  - Server-assisted name search and price slider (`/products/search?name=&price=`)
  - Category-based product discovery (`/products/category/{id}?price=`)
  - Detailed product preview modal with gallery thumbnails, stock pills, and ratings.
- **🛒 Shopping Cart & Checkout Engine:**
  - Interactive slide-over cart drawer (`/carts/my-cart`)
  - Real-time quantity adjustments (`POST /carts/items`), removal, and cart clear.
  - Free shipping progress bar calculator.
  - Multi-tier checkout modal supporting **Cash on Delivery (COD)** and **Digital Bank Transfer** via Spring `RestClient`.
  - Single-item instant purchase workflow (`/orders/place-order`).
- **❤️ Wishlist Synchronization:**
  - Real-time wishlist drawer (`/wishlists`) with instant toggle, removal, and "Move to Cart" action.
- **📦 Customer Order Management:**
  - Personal order history tracking (`/orders/me`) with `OrderStatusBadge` and `PaymentStatusBadge`.
  - Atomic order cancellation (`PATCH /orders/{orderId}/cancel`) restoring inventory and issuing refunds.
- **🏬 Dedicated Seller Portal (`ROLE_SELLER`):**
  - View merchant's own listings (`/products/me`).
  - Create new catalog products (`POST /products`).
  - Edit pricing and stock (`PATCH /products/{id}`).
  - Product image gallery management (`POST`, `PUT`, `DELETE /products/{id}/image`).
  - Order fulfillment advancement (`PATCH /orders/{orderId}/order-status`).
- **🛡️ Platform Governance (`ROLE_ADMIN`):**
  - Category creation, renaming, and deletion (`/categories`).
  - System-wide paginated order management (`/orders`).
  - Payment settlement overrides (`PATCH /orders/{orderId}/payment-status`).
  - Registered user directory inspection and search (`/users`).
- **🔄 Stateless JWT Auth & Refresh Token Rotation (RTR):**
  - Short-lived Access Token auto-injected into `Authorization: Bearer <token>`.
  - Automatic 401 handling with Refresh Token Rotation via `POST /auth/refresh`.
  - One-click demo account switcher (Buyer, Seller, Admin) for frictionless local testing.
- **🌐 Dual-Mode Connectivity Engine:**
  - Live backend health status monitor banner.
  - Switchable between Local (`http://localhost:8080`), Render Cloud (`https://e-commercebackendproject.onrender.com`), Custom URL, or Demo Offline Mode.

---

## 🛠️ Project Structure

```
swiftcart-frontend/
├── src/
│   ├── api/
│   │   ├── client.js          # Unified HTTP client with JWT RTR & error handling
│   │   ├── authApi.js         # /auth endpoints
│   │   ├── productsApi.js     # /products endpoints & image management
│   │   ├── categoriesApi.js   # /categories endpoints
│   │   ├── cartApi.js         # /carts endpoints
│   │   ├── ordersApi.js       # /orders endpoints
│   │   ├── wishlistApi.js     # /wishlists endpoints
│   │   ├── usersApi.js        # /users endpoints
│   │   └── mockData.js        # Offline fallback and demo data
│   ├── context/
│   │   ├── AuthContext.jsx    # User session, roles, and demo role switcher
│   │   ├── CartContext.jsx    # Cart items, badge, totals, and checkout
│   │   ├── WishlistContext.jsx# Wishlist items and toggles
│   │   ├── ConfigContext.jsx  # Backend connection status and environment switch
│   │   └── ToastContext.jsx   # Animated toast alerts
│   ├── components/
│   │   ├── common/            # Modal, Badge, ConfigModal
│   │   ├── layout/            # Navbar, HeroBanner, Footer, BackendStatusBanner
│   │   ├── auth/              # AuthModal (Sign In / Sign Up / Demo Fast Login)
│   │   ├── products/          # ProductCard, ProductGrid, ProductFilters, ProductDetailModal
│   │   ├── cart/              # CartDrawer, CheckoutModal
│   │   ├── orders/            # OrdersList
│   │   ├── wishlist/          # WishlistDrawer
│   │   ├── seller/            # SellerDashboard (Merchant operations)
│   │   ├── admin/             # AdminDashboard (Platform governance)
│   │   └── user/              # ProfileModal
│   ├── App.jsx                # Main application coordinator
│   ├── main.jsx               # React entrypoint
│   └── index.css              # Custom design tokens, glassmorphism, animations
├── vite.config.js             # Vite config with backend proxy to :8080
└── package.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized, minified production bundle in `dist/`.
