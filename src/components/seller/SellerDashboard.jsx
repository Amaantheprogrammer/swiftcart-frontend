import React, { useState, useEffect, useCallback } from "react";
import productsApi from "../../api/productsApi";
import categoriesApi from "../../api/categoriesApi";
import ordersApi from "../../api/ordersApi";
import Modal from "../common/Modal";
import { OrderStatusBadge, StockBadge } from "../common/Badge";
import { Store, Plus, Edit3, Trash2, Image, RefreshCw, Package, ArrowUpRight, Check } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageModalProduct, setImageModalProduct] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState("");

  // New Product Form
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("15");
  const [newCategoryId, setNewCategoryId] = useState("1");
  const [newDescription, setNewDescription] = useState("");
  const [newMainImageUrl, setNewMainImageUrl] = useState("https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80");

  const { success, error } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, cats, ords] = await Promise.all([
        productsApi.getMyProducts().catch(() => []),
        categoriesApi.getAll().catch(() => []),
        ordersApi.getAll(0, 50).catch(() => ({ content: [] })),
      ]);
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
      const ordList = ords.content || (Array.isArray(ords) ? ords : []);
      setOrders(ordList);
    } catch (err) {
      error(err.message || "Failed to load seller data");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newName || !newPrice || !newCategoryId) {
      error("Please fill in all required fields");
      return;
    }
    try {
      await productsApi.create({
        name: newName,
        price: Number(newPrice),
        stockQuantity: Number(newStock),
        categoryId: Number(newCategoryId),
        description: newDescription,
        imageUrl: newMainImageUrl,
      });
      success(`Product "${newName}" created successfully!`);
      setIsAddProductOpen(false);
      setNewName("");
      setNewPrice("");
      setNewDescription("");
      await loadData();
    } catch (err) {
      error(err.message || "Failed to create product");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await productsApi.update(editingProduct.id, {
        name: editingProduct.name,
        price: Number(editingProduct.price),
        stockQuantity: Number(editingProduct.stockQuantity),
        description: editingProduct.description,
      });
      success("Product updated successfully!");
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await productsApi.delete(id);
      success(`Deleted "${name}"`);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to delete product");
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!imageModalProduct || !newImageUrl.trim()) return;
    try {
      await productsApi.addImage(imageModalProduct.id, newImageUrl);
      success("Image added to product!");
      setNewImageUrl("");
      const updated = await productsApi.getById(imageModalProduct.id);
      setImageModalProduct(updated);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to add image");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!imageModalProduct) return;
    try {
      await productsApi.deleteImage(imageModalProduct.id, imageId);
      success("Image deleted");
      const updated = await productsApi.getById(imageModalProduct.id);
      setImageModalProduct(updated);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to delete image");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus);
      success(`Order #${orderId} marked as ${newStatus}`);
      await loadData();
    } catch (err) {
      error(err.message || "Failed to update order status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Merchant Portal • ROLE_SELLER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Seller Operations Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Publish high-margin catalog items, adjust inventory stock in real-time, upload product gallery assets, and advance order fulfillment cycles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${
            activeTab === "products" ? "text-purple-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          My Listed Products ({products.length})
          {activeTab === "products" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${
            activeTab === "orders" ? "text-purple-400" : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Fulfillment Orders ({orders.length})
          {activeTab === "orders" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="p-10 text-center rounded-2xl glass-panel space-y-3">
              <p className="text-slate-300 font-semibold">No products listed under your merchant account.</p>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
              >
                Create Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl glass-card flex flex-col justify-between space-y-3 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                      <img
                        src={
                          p.productImages?.[0]?.imageUrl ||
                          p.imageUrl ||
                          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=80"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-purple-400">ID #{p.id}</span>
                        <StockBadge stock={p.stockQuantity} />
                      </div>
                      <h4 className="font-bold text-sm text-white truncate mt-0.5">{p.name}</h4>
                      <p className="text-xs text-indigo-400 font-bold mt-1">
                        ${Number(p.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setImageModalProduct(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
                      title="Manage Gallery Images"
                    >
                      <Image className="w-3.5 h-3.5 text-purple-400" />
                      <span>Images ({p.productImages?.length || 0})</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingProduct({ ...p })}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-10 text-center rounded-2xl glass-panel text-slate-400 text-sm">
              No orders placed yet.
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="p-4 sm:p-5 rounded-2xl glass-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Order #{o.id}</span>
                    <OrderStatusBadge status={o.orderStatus} />
                    <span className="text-xs text-slate-400 font-medium">Customer: {o.userName || `User #${o.userId}`}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Items: {o.orderItems?.length || 1} • Total: ${Number(o.totalAmount).toFixed(2)} • Payment: {o.paymentMethod}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Update Status:</span>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl glass-input text-xs font-semibold bg-slate-900 border-slate-700 text-slate-200 cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PLACED">PLACED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="RETURNED">RETURNED</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="Create New Marketplace Product"
        subtitle="POST /products - Add to catalog as ROLE_SELLER"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateProduct} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="249.99"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                placeholder="20"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={newCategoryId}
              onChange={(e) => setNewCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-slate-900"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Primary Image URL *
            </label>
            <input
              type="url"
              required
              value={newMainImageUrl}
              onChange={(e) => setNewMainImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="High quality audio, multipoint connectivity..."
              className="w-full px-3.5 py-2 rounded-xl glass-input text-sm resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddProductOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
            >
              Publish Product
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          title={`Edit Product #${editingProduct.id}`}
          subtitle="PATCH /products/{id} - Update price, stock and details"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleUpdateProduct} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Product Title
              </label>
              <input
                type="text"
                required
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editingProduct.stockQuantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editingProduct.description || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-sm resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Product Images Modal */}
      {imageModalProduct && (
        <Modal
          isOpen={!!imageModalProduct}
          onClose={() => setImageModalProduct(null)}
          title={`Gallery for "${imageModalProduct.name}"`}
          subtitle="POST & DELETE /products/{id}/image"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            {/* Add Image Form */}
            <form onSubmit={handleAddImage} className="flex gap-2">
              <input
                type="url"
                required
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste Image URL (https://...)"
                className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shrink-0"
              >
                Add Image
              </button>
            </form>

            {/* Gallery Grid */}
            <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
              {imageModalProduct.productImages?.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-800">
                  <img src={img.imageUrl} alt="Asset" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SellerDashboard;
