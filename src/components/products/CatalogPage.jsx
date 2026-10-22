import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import HeroBanner from "../layout/HeroBanner";
import ProductFilters from "../products/ProductFilters";
import ProductCard from "../products/ProductCard";
import { useToast } from "../../context/ToastContext";
import productsApi from "../../api/productsApi";
import categoriesApi from "../../api/categoriesApi";

const CatalogPage = () => {
  const navigate = useNavigate();
  const { error } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(8);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  // Load Categories once
  useEffect(() => {
    categoriesApi
      .getAll()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Fetch Products based on filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      if (searchQuery.trim()) {
        result = await productsApi.search(searchQuery.trim(), maxPrice < 2500 ? maxPrice : undefined);
      } else if (selectedCategory !== null) {
        result = await productsApi.getByCategory(selectedCategory, maxPrice < 2500 ? maxPrice : undefined);
      } else {
        result = await productsApi.getAll(page, pageSize);
      }

      let list = [];
      if (Array.isArray(result)) {
        list = result;
        setTotalPages(1);
      } else if (result?.content) {
        list = result.content;
        setTotalPages(result.totalPages || 1);
      }
      setProducts(list);
    } catch (err) {
      error(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, maxPrice, page, pageSize, error]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side sorting
  const filteredAndSortedProducts = useMemo(() => {
    let prods = [...products];
    if (maxPrice < 2500) {
      prods = prods.filter((p) => Number(p.price) <= maxPrice);
    }
    if (sortBy === "price-low") {
      prods.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      prods.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name") {
      prods.sort((a, b) => a.name.localeCompare(b.name));
    }
    return prods;
  }, [products, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setMaxPrice(2500);
    setSortBy("newest");
    setPage(0);
  };

  return (
    <div>
      {/* Hero Showcase */}
      <HeroBanner
        onExploreClick={() => {
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
        }}
        onFeaturedClick={() => {
          setMaxPrice(350);
          document.getElementById("catalog-section")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Catalog Section */}
      <section id="catalog-section">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explore Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Showing {filteredAndSortedProducts.length} verified products with real-time stock availability
            </p>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            setPage(0);
          }}
          selectedCategory={selectedCategory}
          setSelectedCategory={(c) => {
            setSelectedCategory(c);
            setPage(0);
          }}
          categories={categories}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onReset={handleResetFilters}
        />

        {/* Products Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="rounded-2xl glass-card aspect-square animate-pulse p-4 space-y-4">
                <div className="w-full h-48 bg-slate-800/80 rounded-xl" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="p-16 rounded-3xl glass-panel text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-800/60 mx-auto flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No matching products found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn't find any products matching your current search parameters. Try adjusting the price slider or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => navigate(`/products/${p.id}`)}
                onQuickBuy={(p) => navigate(`/products/${p.id}`)}
              />
            ))}
          </div>
        ) : (
          /* Compact List View */
          <div className="space-y-3">
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                    <img
                      src={
                        product.productImages?.[0]?.imageUrl ||
                        product.imageUrl ||
                        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-indigo-400">
                      {product.categoryName || "Marketplace"}
                    </span>
                    <h4 className="font-bold text-base text-white truncate mt-0.5 group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Price</span>
                    <span className="text-lg font-bold text-white">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product.id}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && !searchQuery && selectedCategory === null && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold text-slate-300 px-3">
              Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{totalPages}</strong>
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default CatalogPage;
