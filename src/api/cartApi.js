import apiClient from "./client";

export const cartApi = {
  async getMyCart() {
    try {
      return await apiClient.get("/carts/my-cart");
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        return { cartItems: [], total: 0 };
      }
      throw err;
    }
  },

  async updateItemQuantity(productId, quantity) {
    return await apiClient.post("/carts/items", {
      productId: Number(productId),
      quantity: Number(quantity),
    });
  },

  async removeProduct(productId) {
    return await apiClient.delete(`/carts/items/${productId}`);
  },

  async clearCart() {
    return await apiClient.delete("/carts/clear");
  },
};

export default cartApi;
