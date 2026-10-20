import apiClient from "./client";

export const wishlistApi = {
  async getMyWishlist() {
    try {
      return await apiClient.get("/wishlists");
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        return { wishlistItemResponses: [] };
      }
      throw err;
    }
  },

  async addProduct(productId) {
    return await apiClient.post(`/wishlists/${productId}`);
  },

  async removeProduct(productId) {
    return await apiClient.delete(`/wishlists/${productId}`);
  },

  async clear() {
    return await apiClient.delete("/wishlists");
  },
};

export default wishlistApi;
