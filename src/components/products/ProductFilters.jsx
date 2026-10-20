import React from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown, LayoutGrid, List } from "lucide-react";

export const ProductFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onReset,
}) => {
  const hasActiveFilters = searchQuery || selectedCategory !== null || maxPrice < 2500 || sortBy !== "newest";

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Sort Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or features..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl glass-input text-sm text-slate-100 placeholder-slate-500 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort and View Mode */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-3 rounded-2xl glass-input text-xs font-medium text-slate-200 bg-slate-900/90 appearance-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Compact View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories chips and price slider row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-1">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-300"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "bg-slate-900/70 hover:bg-slate-800 border border-slate-800 text-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Price Filter Slider */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-2xl">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 whitespace-nowrap">Max Price:</span>
          <span className="text-xs font-bold text-indigo-400 font-mono w-14">
            ${maxPrice}
          </span>
          <input
            type="range"
            min="20"
            max="2500"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-32 accent-indigo-500 cursor-pointer"
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] font-medium text-slate-400 hover:text-rose-400 transition-colors ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
