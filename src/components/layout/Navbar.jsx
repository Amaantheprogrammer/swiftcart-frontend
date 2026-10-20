import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  ShoppingBag,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  Store,
  ShieldCheck,
  Package,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { RoleBadge } from "../common/Badge";

export const Navbar = ({
  currentView,
  setCurrentView,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { user, isAuthenticated, isAdmin, isSeller, logout } = useAuth();
  const { itemCount, totalAmount, setIsCartOpen } = useCart();
  const { itemCount: wishlistCount, setIsWishlistOpen } = useWishlist();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <div
            onClick={() => handleNavClick("catalog")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Swift<span className="text-indigo-400">Cart</span>
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  v3.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                High-Performance Marketplace
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            <button
              onClick={() => handleNavClick("catalog")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === "catalog"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              Marketplace
            </button>

            {isAuthenticated && (
              <button
                onClick={() => handleNavClick("orders")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === "orders"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </button>
            )}

            {isSeller && (
              <button
                onClick={() => handleNavClick("seller")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === "seller"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-purple-300 hover:text-white hover:bg-purple-950/30"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Portal</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => handleNavClick("admin")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === "admin"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "text-rose-300 hover:text-white hover:bg-rose-950/30"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-rose-400 transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-md animate-scale">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">${totalAmount.toFixed(2)}</span>
              {itemCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-indigo-700 text-[10px] font-extrabold ml-0.5">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden md:inline max-w-[100px] truncate">
                    {user?.name || "My Account"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-slate-200 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="font-bold text-sm text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 font-mono truncate">{user.email}</p>
                      <div className="mt-2">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenProfile) onOpenProfile();
                        }}
                        className="w-full px-4 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-indigo-400" />
                        <span>Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => handleNavClick("orders")}
                        className="w-full px-4 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
                      >
                        <Package className="w-4 h-4 text-blue-400" />
                        <span>My Order History</span>
                      </button>

                      {isSeller && (
                        <button
                          onClick={() => handleNavClick("seller")}
                          className="w-full px-4 py-2 text-xs flex items-center gap-2.5 hover:bg-purple-950/40 text-purple-300 hover:text-white transition-colors text-left"
                        >
                          <Store className="w-4 h-4 text-purple-400" />
                          <span>Seller Portal</span>
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick("admin")}
                          className="w-full px-4 py-2 text-xs flex items-center gap-2.5 hover:bg-rose-950/40 text-rose-300 hover:text-white transition-colors text-left"
                        >
                          <ShieldCheck className="w-4 h-4 text-rose-400" />
                          <span>Admin Control Center</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-xs flex items-center gap-2.5 hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fade-in">
          <button
            onClick={() => handleNavClick("catalog")}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-colors ${
              currentView === "catalog" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-900"
            }`}
          >
            Marketplace
          </button>
          {isAuthenticated && (
            <button
              onClick={() => handleNavClick("orders")}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                currentView === "orders" ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              My Orders
            </button>
          )}
          {isSeller && (
            <button
              onClick={() => handleNavClick("seller")}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                currentView === "seller" ? "bg-purple-600 text-white" : "text-purple-300 hover:bg-slate-900"
              }`}
            >
              Seller Portal
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => handleNavClick("admin")}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                currentView === "admin" ? "bg-rose-600 text-white" : "text-rose-300 hover:bg-slate-900"
              }`}
            >
              Admin Control Center
            </button>
          )}

        </div>
      )}
    </header>
  );
};

export default Navbar;
