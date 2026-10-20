import React, { useState, useEffect, useCallback } from "react";
import categoriesApi from "../../api/categoriesApi";
import ordersApi from "../../api/ordersApi";
import usersApi from "../../api/usersApi";
import Modal from "../common/Modal";
import { OrderStatusBadge, PaymentStatusBadge, RoleBadge } from "../common/Badge";
import { ShieldCheck, Layers, Package, Users, Plus, Edit3, Trash2, RefreshCw, Search, Check } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("categories"); // 'categories', 'orders', 'users'
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");

  // Orders Filter
  const [userIdFilter, setUserIdFilter] = useState("");

  // Users Filter
  const [userEmailSearch, setUserEmailSearch] = useState("");

  const { success, error } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, ords, usrs] = await Promise.all([
        categoriesApi.getAll().catch(() => []),
        ordersApi.getAll(0, 50).catch(() => ({ content: [] })),
        usersApi.getAll().catch(() => []),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      const ordList = ords.content || (Array.isArray(ords) ? ords : []);
      setOrders(ordList);
      setUsers(Array.isArray(usrs) ? usrs : []);
    } catch (err) {
      error(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Category handlers
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
    if (!window.confirm(`Are you sure you want to delete category "${name}"? If products belong to this category, deletion will be blocked by backend.`)) {
      return;
    }
    try {
      await categoriesApi.delete(id);
      success(`Deleted category "${name}"`);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to delete category");
    }
  };

  // Payment status handler
  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await ordersApi.updatePaymentStatus(orderId, newStatus);
      success(`Order #${orderId} payment updated to ${newStatus}`);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to update payment status");
    }
  };

  // User search handler
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
            Control global taxonomy & categories, inspect cross-system transactional orders, manage financial settlement statuses, and monitor registered identities.
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

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 px-4 text-sm font-semibold transition-colors flex items-center gap-2 relative ${
            activeTab === "categories" ? "text-rose-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <Layers className="w-4 h-4" />
          Categories ({categories.length})
          {activeTab === "categories" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 text-sm font-semibold transition-colors flex items-center gap-2 relative ${
            activeTab === "orders" ? "text-rose-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <Package className="w-4 h-4" />
          Platform Orders ({orders.length})
          {activeTab === "orders" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 text-sm font-semibold transition-colors flex items-center gap-2 relative ${
            activeTab === "users" ? "text-rose-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <Users className="w-4 h-4" />
          Users Directory ({users.length})
          {activeTab === "users" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Categories View */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400">
              Manage product hierarchy and store catalog categories.
            </p>
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

      {/* Orders View */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            System-wide paginated order management with payment status overrides (Spring RestClient Digital Banking synchronization).
          </p>

          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="p-4 sm:p-5 rounded-2xl glass-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Order #{o.id}</span>
                    <OrderStatusBadge status={o.orderStatus} />
                    <PaymentStatusBadge status={o.paymentStatus} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Customer: <strong className="text-slate-200">{o.userName || `User #${o.userId}`}</strong> • Amount: <strong className="text-white">${Number(o.totalAmount).toFixed(2)}</strong> • Method: {o.paymentMethod}
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

      {/* Users View */}
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
              <div
                key={u.id}
                className="p-4 rounded-2xl glass-card space-y-2 border border-slate-800"
              >
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
