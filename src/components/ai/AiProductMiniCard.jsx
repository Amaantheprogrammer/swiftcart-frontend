import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CheckCircle2, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";

export const AiProductMiniCard = ({ product, onNavigate }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const imageUrl =
    product.productImages?.[0]?.imageUrl ||
    product.imageUrl ||
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80";

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addToCart(product.id, 1, product.name);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClick = () => {
    if (onNavigate) onNavigate();
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500/60 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-md"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80";
            }}
          />
        </div>

        <div className="min-w-0">
          <span className="text-[10px] font-semibold text-indigo-400 block truncate">
            {product.categoryName || "Marketplace"}
          </span>
          <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
            {product.name}
          </p>
          <p className="text-xs font-extrabold text-emerald-400">
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || product.stockQuantity <= 0}
          className={`p-2 rounded-lg text-xs font-semibold transition-all ${
            added
              ? "bg-emerald-600/30 text-emerald-300"
              : "bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white"
          }`}
          title="Add to Cart"
        >
          {added ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ShoppingCart className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={handleClick}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="View Details"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AiProductMiniCard;
