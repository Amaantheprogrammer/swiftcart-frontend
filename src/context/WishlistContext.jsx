import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import wishlistApi from "../api/wishlistApi";
import { useToast } from "./ToastContext";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { success, info, error } = useToast();
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const data = await wishlistApi.getMyWishlist();
      setWishlist(data);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, isAuthenticated]);

  const items = wishlist?.wishlistItemResponses || [];

  const isInWishlist = useCallback(
    (productId) => {
      const pId = Number(productId);
      return items.some((item) => Number(item.productId) === pId);
    },
    [items]
  );

  const toggleWishlist = async (product) => {
    const pId = Number(product.id || product.productId);
    const inList = isInWishlist(pId);

    try {
      if (inList) {
        await wishlistApi.removeProduct(pId);
        setWishlist((prev) => ({
          ...prev,
          wishlistItemResponses: (prev?.wishlistItemResponses || []).filter(
            (item) => Number(item.productId) !== pId
          ),
        }));
        info(`Removed "${product.name || 'Product'}" from wishlist`);
      } else {
        const updated = await wishlistApi.addProduct(pId);
        setWishlist(updated);
        success(`Added "${product.name || 'Product'}" to wishlist ❤️`);
      }
    } catch (err) {
      error(err.message || "Failed to update wishlist");
    }
  };

  const removeFromWishlist = async (productId, name = "Product") => {
    try {
      const pId = Number(productId);
      await wishlistApi.removeProduct(pId);
      setWishlist((prev) => ({
        ...prev,
        wishlistItemResponses: (prev?.wishlistItemResponses || []).filter(
          (item) => Number(item.productId) !== pId
        ),
      }));
      info(`Removed "${name}" from wishlist`);
    } catch (err) {
      error(err.message || "Failed to remove item");
    }
  };

  const clearWishlist = async () => {
    try {
      await wishlistApi.clear();
      setWishlist((prev) => ({
        ...prev,
        wishlistItemResponses: [],
      }));
      info("Wishlist cleared");
    } catch (err) {
      error(err.message || "Failed to clear wishlist");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        items,
        itemCount: items.length,
        loading,
        isWishlistOpen,
        setIsWishlistOpen,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
