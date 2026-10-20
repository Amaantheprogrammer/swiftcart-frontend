import React, { useState, useEffect, useCallback } from "react";
import ordersApi from "../../api/ordersApi";
import { OrderStatusBadge, PaymentStatusBadge } from "../common/Badge";
import { Package, Calendar, Clock, RefreshCw, XCircle, ArrowRight } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const { success, error } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersApi.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderId}? Stock will be restored and payment refunded.`)) {
      return;
    }
    setCancellingId(orderId);
    try {
      await ordersApi.cancelOrder(orderId);
      success(`Order #${orderId} has been cancelled successfully`);
      await fetchOrders();
    } catch (err) {
      error(err.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-400" />
            My Order History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time delivery status, transactional records, and atomic order cancellations
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl glass-card animate-pulse space-y-4">
              <div className="h-5 bg-slate-800 rounded w-1/4" />
              <div className="h-10 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-800/60 mx-auto flex items-center justify-center text-slate-500">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No Orders Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't placed any orders yet. Explore our marketplace and place your first order today!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isCancellable = order.orderStatus === "PENDING" || order.orderStatus === "PLACED";

            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-2xl glass-card hover:border-slate-700 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-base">
                      Order #{order.id}
                    </span>
                    <OrderStatusBadge status={order.orderStatus} />
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Recent"}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Purchased Items
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {order.orderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-200">
                          Product ID #{item.productId}
                        </span>
                        <div className="text-right">
                          <span className="text-slate-400">{item.quantity}x </span>
                          <span className="font-bold text-white">
                            ${Number(item.priceAtPurchase).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer and cancel action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                  <div className="text-xs text-slate-400">
                    Payment Method:{" "}
                    <span className="font-semibold text-slate-200">
                      {order.paymentMethod?.replace("_", " ") || "Standard"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total</span>
                      <span className="text-lg font-extrabold text-white">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>

                    {isCancellable && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{cancellingId === order.id ? "Cancelling..." : "Cancel Order"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
