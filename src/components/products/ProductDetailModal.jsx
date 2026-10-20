import React, { useState } from "react";
import Modal from "../common/Modal";
import { Heart, ShoppingCart, Zap, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { StockBadge } from "../common/Badge";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export const ProductDetailModal = ({ product, isOpen, onClose, onQuickBuy }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const images = product.productImages?.length
    ? product.productImages.map((i) => i.imageUrl)
    : [product.imageUrl || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"];

  const currentImage = images[selectedImageIndex] || images[0];
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product.id, quantity, product.name);
      onClose();
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    onClose();
    if (onQuickBuy) {
      onQuickBuy(product, quantity);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      subtitle={`Category: ${product.categoryName || "Marketplace"} • ID #${product.id}`}
      maxWidth="max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left: Gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={currentImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-all duration-300"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";
              }}
            />
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all ${
                isLiked
                  ? "bg-rose-500/20 border-rose-500/50 text-rose-400 scale-110"
                  : "bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white"
              }`}
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === index
                      ? "border-indigo-500 shadow-md shadow-indigo-500/30"
                      : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase actions */}
        <div className="flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <StockBadge stock={product.stockQuantity} />
              <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold">4.9 / 5.0 (128 reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-emerald-400 font-medium">Free Express Shipping</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description || "Crafted with exceptional materials and precision engineering. Verified authentic item on SwiftCart."}
            </p>

            {/* Quality assurance badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/40">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Authentic</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/40">
                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/40">
                <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />
                <span>30-Day Return</span>
              </div>
            </div>
          </div>

          {/* Stepper & Action buttons */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center border border-slate-700 rounded-xl bg-slate-800/50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 99, q + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || product.stockQuantity <= 0}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4 text-indigo-400" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stockQuantity <= 0}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Instant Buy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
