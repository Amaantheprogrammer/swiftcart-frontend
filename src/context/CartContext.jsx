import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import cartApi from "../api/cartApi";
import ordersApi from "../api/ordersApi";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { success, error, info } = useToast();
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await cartApi.getMyCart();
      setCart(data);
    } catch {
      // Ignore or silence when unauthenticated
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, isAuthenticated]);

  const addToCart = async (productId, quantity = 1, productName = "Product") => {
    try {
      const updated = await cartApi.updateItemQuantity(productId, quantity);
      setCart(updated);
      success(`Added ${productName} to cart!`);
      return updated;
    } catch (err) {
      error(err.message || "Failed to add item to cart");
      throw err;
    }
  };

  const updateQuantity = async (productId, delta) => {
    try {
      const updated = await cartApi.updateItemQuantity(productId, delta);
      setCart(updated);
      return updated;
    } catch (err) {
      error(err.message || "Failed to update quantity");
    }
  };

  const removeItem = async (productId, productName = "Item") => {
    try {
      const updated = await cartApi.removeProduct(productId);
      setCart(updated);
      info(`Removed ${productName} from cart`);
      return updated;
    } catch (err) {
      error(err.message || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart({
        id: cart?.id || 1,
        userId: cart?.userId || 1,
        cartItems: [],
        total: 0,
      });
      info("Cart cleared");
    } catch (err) {
      error(err.message || "Failed to clear cart");
    }
  };

  const checkoutCart = async () => {
    try {
      setLoading(true);
      const placedOrders = await ordersApi.placeOrderFromCart();
      await fetchCart();
      success("Order placed successfully from cart!");
      return placedOrders;
    } catch (err) {
      error(err.message || "Failed to checkout cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buyDirect = async ({ productId, quantity, address, accountNumber }) => {
    try {
      setLoading(true);
      const order = await ordersApi.placeOrder({
        productId,
        quantity,
        address,
        accountNumber,
      });
      success("Direct purchase successful! Order placed.");
      return order;
    } catch (err) {
      error(err.message || "Failed to place direct order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.cartItems || [];
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalAmount = cart?.total || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        totalAmount,
        loading,
        isCartOpen,
        setIsCartOpen,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        checkoutCart,
        buyDirect,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
