import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { ToastProvider, useToast } from "./context/ToastContext";
import { ConfigProvider } from "./context/ConfigContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

import BackendStatusBanner from "./components/layout/BackendStatusBanner";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import CatalogPage from "./components/products/CatalogPage";
import ProductPage from "./components/products/ProductPage";

import CartDrawer from "./components/cart/CartDrawer";
import CheckoutModal from "./components/cart/CheckoutModal";
import WishlistDrawer from "./components/wishlist/WishlistDrawer";

import OrdersList from "./components/orders/OrdersList";
import SellerDashboard from "./components/seller/SellerDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

import AuthModal from "./components/auth/AuthModal";
import ProfileModal from "./components/user/ProfileModal";

// ──────────────────────────────────────────────────────────────
// Protected route wrappers
// ──────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, requiredAuth = true, requiredAdmin = false, requiredSeller = false }) => {
  const { isAuthenticated, isAdmin, isSeller, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-600/30 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (requiredAuth && !isAuthenticated) return <Navigate to="/" replace />;
  if (requiredAdmin && !isAdmin) return <Navigate to="/" replace />;
  if (requiredSeller && !isSeller) return <Navigate to="/" replace />;

  return children;
};

// ──────────────────────────────────────────────────────────────
// Main app shell (inside Router context)
// ──────────────────────────────────────────────────────────────
const AppShell = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { setIsCartOpen } = useCart();

  const handleProceedCartCheckout = () => {
    setDirectCheckoutItem(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Backend Connection Monitor Banner */}
      <BackendStatusBanner />

      {/* Global Navigation Bar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Page Routes */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductPage />} />

          {/* Authenticated routes */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredAuth>
                <OrdersList />
              </ProtectedRoute>
            }
          />

          {/* Seller routes */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute requiredSeller>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Drawers & Overlays */}
      <CartDrawer onProceedToCheckout={handleProceedCartCheckout} />

      <WishlistDrawer />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectCheckoutItem(null);
        }}
        directItem={directCheckoutItem}
        onOrderSuccess={() => {
          navigate("/orders");
        }}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Root export with all providers
// ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AppShell />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}