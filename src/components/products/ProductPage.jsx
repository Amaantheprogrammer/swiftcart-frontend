import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  User,
  Tag,
  ChevronRight,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { StockBadge } from "../common/Badge";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import productsApi from "../../api/productsApi";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { error: showError } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.getById(id);
      setProduct(data);
    } catch (err) {
      showError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [id, showError]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchProduct]);

  const isLiked = product ? isInWishlist(product.id) : false;
  const images = product?.productImages?.length
    ? product.productImages.map((i) => i.imageUrl)
    : [product?.imageUrl || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"];

  const currentImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity, product.name);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigate("/checkout", { state: { directItem: { product, quantity } } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 animate-pulse mx-auto" />
          <div className="h-4 bg-slate-800 rounded w-48 mx-auto animate-pulse" />
          <div className="h-3 bg-slate-800 rounded w-32 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <Package className="w-16 h-16 text-slate-600" />
        <h2 className="text-xl font-bold text-white">Product not found</h2>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Marketplace
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-500">{product.categoryName || "Products"}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── Left: Image Gallery ── */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl group">
              <img
                src={currentImage}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";
                }}
              />

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md border transition-all shadow-lg ${
                  isLiked
                    ? "bg-rose-500/25 border-rose-500/60 text-rose-400 scale-110"
                    : "bg-slate-900/70 border-slate-700 text-slate-300 hover:text-white hover:scale-105"
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>

              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-semibold text-indigo-400 border border-indigo-500/30">
                  {product.categoryName || "Marketplace"}
                </span>
              </div>

              {/* Stock overlay at bottom */}
              <div className="absolute bottom-4 left-4">
                <StockBadge stock={product.stockQuantity} />
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all border-2 ${
                      selectedImageIndex === index
                        ? "border-indigo-500 shadow-lg shadow-indigo-500/30 opacity-100"
                        : "border-slate-800 opacity-55 hover:opacity-90"
                    }`}
                  >
                    <img src={imgUrl} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Share button */}
            <button
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share this product
            </button>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                  #{product.id}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">4.9 / 5.0 (128 reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {product.userName && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sold by <strong className="text-slate-200">{product.userName}</strong></span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800/60 border border-slate-800">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-white">
                  ${Number(product.price).toFixed(2)}
                </span>
                <div className="space-y-0.5">
                  <span className="block text-xs text-emerald-400 font-semibold">Free Express Shipping</span>
                  <span className="block text-[11px] text-slate-400">Inclusive of all taxes</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">About this item</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {product.description ||
                  "Crafted with exceptional materials and precision engineering. Verified authentic item on SwiftCart Marketplace."}
              </p>
            </div>

            {/* Quality assurance */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-400 font-medium">Verified Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <Truck className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 font-medium">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                <RotateCcw className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 font-medium">30-Day Return</span>
              </div>
            </div>

            {/* Quantity + Actions */}
            <div className="space-y-4 pt-2">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Quantity</span>
                <div className="flex items-center border border-slate-700 rounded-xl bg-slate-800/50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-black text-base text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 99, q + 1))}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stockQuantity <= 0}
                  className={`py-4 px-5 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${
                    addedToCart
                      ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400"
                      : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 text-indigo-400" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity <= 0}
                  className="py-4 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Zap className="w-5 h-5 text-amber-300" />
                  Buy Now
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`w-full py-3 px-5 rounded-2xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  isLiked
                    ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
                    : "border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                {isLiked ? "Remove from Wishlist" : "Save to Wishlist"}
              </button>
            </div>

            {/* Meta Info */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span>Category: <strong className="text-slate-200">{product.categoryName}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Stock: <strong className="text-slate-200">{product.stockQuantity} units</strong></span>
              </div>
              {product.createdAt && (
                <div className="flex items-center gap-1.5 col-span-2">
                  <span>Listed: <strong className="text-slate-200">{new Date(product.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
