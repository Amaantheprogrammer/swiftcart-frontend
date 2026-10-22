import React, { useState, useEffect, useCallback } from "react";
import categoriesApi from "../../api/categoriesApi";
import ordersApi from "../../api/ordersApi";
import usersApi from "../../api/usersApi";
import productsApi from "../../api/productsApi";
import Modal from "../common/Modal";
import { OrderStatusBadge, PaymentStatusBadge, RoleBadge, StockBadge } from "../common/Badge";
import {
  ShieldCheck,
  Layers,
  Package,
  Users,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("approvals"); // 'approvals', 'categories', 'orders', 'users'
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product approval sub-filter: 'pending' | 'all'
  const [approvalFilter, setApprovalFilter] = useState("pending");
  const [approvingId, setApprovingId] = useState(null);

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");

  // Users Filter
  const [userEmailSearch, setUserEmailSearch] = useState("");

  const { success, error } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, ords, usrs, pending, allProd] = await Promise.all([
        categoriesApi.getAll().catch(() => []),
        ordersApi.getAll(0, 50).catch(() => ({ content: [] })),
        usersApi.getAll().catch(() => []),
        productsApi.getPending().catch(() => ({ content: [] })),
        productsApi.getAllAdmin().catch(() => ({ content: [] })),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      const ordList = ords.content || (Array.isArray(ords) ? ords : []);
      setOrders(ordList);
      setUsers(Array.isArray(usrs) ? usrs : []);
      setPendingProducts(pending.content || (Array.isArray(pending) ? pending : []));
      setAllProducts(allProd.content || (Array.isArray(allProd) ? allProd : []));
    } catch (err) {
      error(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Product Approval handlers ───────────────────────────────────────────
  const handleApproveProduct = async (productId, productName) => {
    setApprovingId(productId);
    try {
      await productsApi.approve(productId);
      success(`"${productName}" approved and published to marketplace!`);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to approve product");
    } finally {
      setApprovingId(null);
    }
  };

  // ─── Category handlers ────────────────────────────────────────────────────
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) return;
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryNameInput);
        success(`Category updated to "${categoryNameInput}"`);
      } else {
        await categoriesApi.create(categoryNameInput);
        success(`Created category "${categoryNameInput}"`);
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryNameInput("");
      await loadData();
    } catch (err) {
      error(err.message || "Category operation failed");
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete category "${name}"? If products belong to this category, deletion will be blocked by backend.`
      )
    )
      return;
    try {
      await categoriesApi.delete(id);
      success(`Deleted category "${name}"`);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to delete category");
    }
  };

  // ─── Payment status handler ──────────────────────────────────────────────
  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await ordersApi.updatePaymentStatus(orderId, newStatus);
      success(`Order #${orderId} payment updated to ${newStatus}`);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to update payment status");
    }
  };

  // ─── User search handler ─────────────────────────────────────────────────
  const handleSearchUsers = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getAll(userEmailSearch);
      setUsers(Array.isArray(res) ? res : [res]);
    } catch (err) {
      error(err.message || "User search failed");
    } finally {
      setLoading(false);
    }
  };

  const displayedProducts = approvalFilter === "pending" ? pendingProducts : allProducts;

  const TABS = [
    {
      id: "approvals",
      label: "Product Approvals",
      icon: <CheckCircle2 className="w-4 h-4" />,
      count: pendingProducts.length,
      color: "amber",
    },
    {
      id: "categories",
      label: "Categories",
      icon: <Layers className="w-4 h-4" />,
      count: categories.length,
      color: "rose",
    },
    {
      id: "orders",
      label: "Platform Orders",
      icon: <Package className="w-4 h-4" />,
      count: orders.length,
      color: "rose",
    },
    {
      id: "users",
      label: "Users Directory",
      icon: <Users className="w-4 h-4" />,
      count: users.length,
      color: "rose",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-red-900/30 to-slate-900 border border-rose-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Governance • ROLE_ADMIN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrator Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Review &amp; approve seller products, manage catalog taxonomy, inspect platform orders, and monitor registered identities.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh All</span>
        </button>
      </div>

      {/* Pending alert bar */}
      {pendingProducts.length > 0 && activeTab !== "approvals" && (
        <div
          onClick={() => setActiveTab("approvals")}
          className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-300">
              {pendingProducts.length} product{pendingProducts.length !== 1 ? "s" : ""} awaiting your approval
            </p>
            <p className="text-xs text-amber-400/70 mt-0.5">Click to review pending products →</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-800 gap-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-sm font-semibold transition-colors flex items-center gap-2 relative ${
              activeTab === tab.id
                ? tab.id === "approvals"
                  ? "text-amber-400"
                  : "text-rose-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab.id === "approvals" && pendingProducts.length > 0
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                  tab.id === "approvals" ? "bg-amber-500" : "bg-rose-500"
                }`}
              />
            )}
          </button>
        ))}
      </div>

      {/* ══ TAB: Product Approvals ══════════════════════════════════════════════ */}
      {activeTab === "approvals" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Product Review Queue</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Approve seller-submitted products to publish them to the public marketplace.
              </p>
            </div>

            {/* Sub-filter toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setApprovalFilter("pending")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  approvalFilter === "pending"
                    ? "bg-amber-500/20 text-amber-300 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Pending ({pendingProducts.length})
              </button>
              <button
                onClick={() => setApprovalFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  approvalFilter === "all"
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All Products ({allProducts.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-2xl glass-card p-4 animate-pulse h-40" />
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="p-12 rounded-2xl glass-panel text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">
                {approvalFilter === "pending" ? "All caught up!" : "No products found"}
              </h4>
              <p className="text-xs text-slate-400">
                {approvalFilter === "pending"
                  ? "There are no products currently awaiting approval."
                  : "No products have been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedProducts.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl glass-card flex flex-col justify-between gap-3 transition-all ${
                    p.approved
                      ? "border-emerald-500/20 hover:border-emerald-500/30"
                      : "border-amber-500/20 hover:border-amber-500/30"
                  }`}
                >
                  {/* Product card header */}
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                      <img
                        src={
                          p.productImages?.[0]?.imageUrl ||
                          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-mono text-slate-500">ID #{p.id}</span>
                        {p.approved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-white truncate mt-0.5">{p.name}</h4>
                      <p className="text-xs text-indigo-400 font-bold">${Number(p.price).toFixed(2)}</p>
                      {p.userName && (
                        <p className="text-[11px] text-slate-500 mt-0.5">by {p.userName}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
                    <span className="text-[11px] text-slate-500 mr-auto">{p.categoryName}</span>
                    <StockBadge stock={p.stockQuantity} />

                    {/* View button */}
                    <button
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="View Product"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Approve button */}
                    {!p.approved && (
                      <button
                        onClick={() => handleApproveProduct(p.id, p.name)}
                        disabled={approvingId === p.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none"
                        title="Approve & Publish"
                      >
                        {approvingId === p.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ TAB: Categories ════════════════════════════════════════════════════ */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400">Manage product hierarchy and store catalog categories.</p>
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryNameInput("");
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl glass-card flex items-center justify-between gap-3 hover:border-rose-500/30 transition-all"
              >
                <div>
                  <span className="text-[11px] font-mono text-slate-500">ID #{cat.id}</span>
                  <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setCategoryNameInput(cat.name);
                      setIsCategoryModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Edit Name"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB: Orders ════════════════════════════════════════════════════════ */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            System-wide paginated order management with payment status overrides.
          </p>

          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="p-4 sm:p-5 rounded-2xl glass-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">Order #{o.id}</span>
                    <OrderStatusBadge status={o.orderStatus} />
                    <PaymentStatusBadge status={o.paymentStatus} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Customer:{" "}
                    <strong className="text-slate-200">{o.userName || `User #${o.userId}`}</strong> •
                    Amount: <strong className="text-white">${Number(o.totalAmount).toFixed(2)}</strong> •
                    Method: {o.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Payment Status:</span>
                  <select
                    value={o.paymentStatus}
                    onChange={(e) => handleUpdatePaymentStatus(o.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl glass-input text-xs font-semibold bg-slate-900 border-slate-700 text-slate-200 cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB: Users ═════════════════════════════════════════════════════════ */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex gap-2 max-w-md">
            <input
              type="email"
              value={userEmailSearch}
              onChange={(e) => setUserEmailSearch(e.target.value)}
              placeholder="Search user by exact email..."
              className="flex-1 px-3.5 py-2 rounded-xl glass-input text-xs"
            />
            <button
              onClick={handleSearchUsers}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
            {userEmailSearch && (
              <button
                onClick={() => {
                  setUserEmailSearch("");
                  loadData();
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((u) => (
              <div key={u.id} className="p-4 rounded-2xl glass-card space-y-2 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">User #{u.id}</span>
                  <RoleBadge role={u.role} />
                </div>
                <h4 className="font-bold text-sm text-white">{u.name}</h4>
                <p className="text-xs text-slate-400 font-mono truncate">{u.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Create/Edit Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Create New Category"}
        subtitle="Manage taxonomy categories in Spring Data JPA"
        maxWidth="max-w-sm"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              placeholder="e.g. Smart Wearables"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
            >
              {editingCategory ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
