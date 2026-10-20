import React from "react";
import { ShoppingBag, ShieldCheck, Zap, Server, ExternalLink, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Swift<span className="text-indigo-400">Cart</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise multi-tier e-commerce marketplace powered by Spring Boot 3.5, Redis Caching, dual-token JWT authentication, and Spring RestClient banking integration.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Marketplace Features
            </p>
            <ul className="space-y-1.5 text-xs">
              <li>Instant Cart & Direct Checkout</li>
              <li>Dual-Token Refresh Token Rotation</li>
              <li>Sub-millisecond Redis Cache Layer</li>
              <li>Atomic Stock Decrement & Refund Engine</li>
            </ul>
          </div>

          {/* Architecture & Backend */}
          <div className="space-y-2">
            <p className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Backend Infrastructure
            </p>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Java 21 & Spring Boot 3.5
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Redis Caching & Token TTLs
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Spring Data JPA & MySQL
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Digital Banking RestClient
              </li>
            </ul>
          </div>

          {/* Documentation & Links */}
          <div className="space-y-3">
            <p className="font-semibold text-white uppercase tracking-wider text-[11px]">
              API Documentation
            </p>
            <p className="text-xs text-slate-400">
              Explore all 44 REST endpoints with full schemas and payload examples.
            </p>
            <a
              href="https://e-commercebackendproject.onrender.com/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white text-xs font-medium transition-colors"
            >
              <span>Interactive Swagger UI</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© 2026 SwiftCart Marketplace. Engineered with precision by Amaan.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Stateless JWT Security
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Redis Multi-Region
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
