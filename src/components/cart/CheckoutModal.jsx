import React, { useState } from "react";
import Modal from "../common/Modal";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { CreditCard, Truck, CheckCircle2, MapPin, Building, Lock } from "lucide-react";

export const CheckoutModal = ({
  isOpen,
  onClose,
  directItem = null, // { product, quantity }
  onOrderSuccess,
}) => {
  const { cart, totalAmount, checkoutCart, buyDirect } = useCart();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [paymentMethod, setPaymentMethod] = useState(user?.paymentMethod || "CASH_ON_DELIVERY");
  const [address, setAddress] = useState(user?.address || "42 Innovation Blvd, Suite 10, Silicon City");
  const [accountNumber, setAccountNumber] = useState("ACC-8899-7721-00");
  const [isPlacing, setIsPlacing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const isDirect = !!directItem;
  const directTotal = isDirect ? Number(directItem.product.price) * Number(directItem.quantity) : 0;
  const grandTotal = isDirect ? directTotal : totalAmount;

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      error("Delivery address is required");
      return;
    }
    if (paymentMethod === "BANK_TRANSFER" && !accountNumber.trim()) {
      error("Bank account number is required for Bank Transfer");
      return;
    }

    setIsPlacing(true);
    try {
      if (isDirect) {
        const order = await buyDirect({
          productId: directItem.product.id,
          quantity: directItem.quantity,
          address,
          accountNumber: paymentMethod === "BANK_TRANSFER" ? accountNumber : undefined,
        });
        setPlacedOrderDetails(order);
      } else {
        const orders = await checkoutCart();
        setPlacedOrderDetails(Array.isArray(orders) ? orders[0] : orders);
      }
      setIsCompleted(true);
      if (onOrderSuccess) onOrderSuccess();
    } catch (err) {
      error(err.message || "Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  };

  const handleModalClose = () => {
    setIsCompleted(false);
    setPlacedOrderDetails(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isCompleted ? "Order Confirmed!" : "Checkout & Payment"}
      subtitle={isCompleted ? "Your order is being processed by the merchant" : "Complete your purchase with secure instant fulfillment"}
      maxWidth="max-w-lg"
    >
      {isCompleted ? (
        <div className="py-6 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-bold text-white">Thank You for Your Order!</h3>
          <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            Order <strong className="text-white">#{placedOrderDetails?.id || "ORD-2026"}</strong> has been placed. Real-time updates have been broadcasted to the seller.
          </p>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 text-left text-xs space-y-2 max-w-sm mx-auto">
            <div className="flex justify-between text-slate-400">
              <span>Amount Paid:</span>
              <span className="font-bold text-white">${grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Mode:</span>
              <span className="font-semibold text-slate-200">{paymentMethod.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Delivery Address:</span>
              <span className="text-slate-200 truncate max-w-[200px]">{address}</span>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <form onSubmit={handleConfirmOrder} className="space-y-4">
          {/* Order Summary Pill */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <p className="text-slate-400">Total Purchase Amount</p>
              <p className="text-lg font-bold text-white mt-0.5">
                ${grandTotal.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Items: </span>
              <span className="font-semibold text-slate-200">
                {isDirect ? `${directItem.quantity}x ${directItem.product.name}` : `${cart?.cartItems?.length || 0} Products`}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Delivery Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, Apartment / Suite, City, Postal Code"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm resize-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === "CASH_ON_DELIVERY"
                    ? "bg-indigo-950/40 border-indigo-500 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Truck className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="font-semibold text-xs text-white">Cash on Delivery</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Pay in cash when delivered</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "bg-indigo-950/40 border-indigo-500 text-white"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-400 mb-1" />
                <span className="font-semibold text-xs text-white">Bank Transfer</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Direct inter-service transfer</span>
              </button>
            </div>
          </div>

          {/* Bank Account field if Bank Transfer */}
          {paymentMethod === "BANK_TRANSFER" && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 animate-fade-in">
              <label className="block text-xs font-medium text-slate-300">
                Digital Banking Account Number
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. ACC-1092-4821"
                  className="w-full pl-9 pr-3 py-2 rounded-lg glass-input text-xs font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Routed via Spring RestClient directly to the digital banking core.
              </p>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isPlacing}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isPlacing
                ? "Processing Transaction..."
                : `Authorize & Place Order • $${grandTotal.toFixed(2)}`}
            </span>
          </button>
        </form>
      )}
    </Modal>
  );
};

export default CheckoutModal;
