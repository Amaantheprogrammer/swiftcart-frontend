import React from "react";
import { Sparkles, ShieldCheck, Zap, Truck, ArrowRight, Tag } from "lucide-react";

export const HeroBanner = ({ onExploreClick, onFeaturedClick }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/40 border border-indigo-500/20 p-6 sm:p-10 lg:p-12 mb-10 shadow-2xl">
      {/* Background glow orbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spring Boot 3.5 & React 19 Powered</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Curated Excellence.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Instant Commerce.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Discover verified consumer electronics, luxury wearables, and studio accessories with stateless dual-token security, atomic stock validation, and instant bank settlement.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.98]"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onFeaturedClick}
              className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-purple-400" />
              <span>Flash Deals</span>
            </button>
          </div>

          {/* Highlights */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Free Delivery &gt; $150</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Redis Sub-ms Cache</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Verified Sellers</span>
            </div>
          </div>
        </div>

        {/* Right Featured Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl glass-card p-4 sm:p-5 border border-white/10 shadow-2xl backdrop-blur-2xl hover:border-indigo-500/40 transition-all group">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-4">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                alt="Featured Product"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
                Hot Deal -25%
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                  Audio & Sound
                </span>
                <h3 className="font-bold text-base text-white mt-0.5">
                  Aura Sound Pro ANC Headphones
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Active noise cancelling with 40-hour battery life.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 line-through">$399.99</span>
                <span className="text-xl font-extrabold text-white block">$299.99</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
