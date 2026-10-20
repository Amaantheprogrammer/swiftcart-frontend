import React, { useState } from "react";
import { Heart, ShoppingCart, Zap, Star } from "lucide-react";
import { StockBadge } from "../common/Badge";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export const ProductCard = ({ product, onSelectProduct, onQuickBuy }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const isLiked = isInWishlist(product.id);
  const mainImage =
    product.productImages?.[0]?.imageUrl ||
    product.imageUrl ||
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(product.id, 1, product.name);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleLike = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickBuy = (e) => {
    e.stopPropagation();
    if (onQuickBuy) onQuickBuy(product);
  };

  return (
    <div
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className="group relative flex flex-col rounded-2xl glass-card overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-900/80">
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80";
          }}
        />

        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700/60 shadow-md">
            {product.categoryName || "Marketplace"}
          </span>

          <button
            type="button"
            onClick={handleToggleLike}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md border transition-all ${
              isLiked
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400 scale-110"
                : "bg-slate-900/70 border-slate-700/60 text-slate-300 hover:text-white hover:scale-105"
            }`}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>

        {/* Bottom image overlay badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <StockBadge stock={product.stockQuantity} />
          <div className="flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-800">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>4.9</span>
          </div>
        </div>
      </div>

      {/* Content info */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h4 className="font-semibold text-base text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
          {product.name}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {product.description || "Premium product listed on SwiftCart."}
        </p>

        {/* Price & action buttons */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Price</span>
            <span className="text-lg font-bold text-white tracking-tight">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleQuickBuy}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Instant Purchase"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Buy</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || product.stockQuantity <= 0}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              title="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
