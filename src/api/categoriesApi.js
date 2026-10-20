import apiClient from "./client";

export const categoriesApi = {
  async getAll() {
    try {
      const data = await apiClient.get("/categories");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      // If unauthenticated (Spring Security method security returns 403 for guest on /categories),
      // seamlessly extract distinct categories from real live products on Render instead of mock data
      if (err.status === 403 || err.status === 401) {
        try {
          const productsData = await apiClient.get("/products?size=100");
          const products = Array.isArray(productsData) ? productsData : productsData?.content || [];
          const categoryMap = new Map();
          for (const p of products) {
            if (p.categoryId && p.categoryName && !categoryMap.has(p.categoryId)) {
              categoryMap.set(p.categoryId, { id: p.categoryId, name: p.categoryName });
            }
          }
          return Array.from(categoryMap.values()).sort((a, b) => a.id - b.id);
        } catch {
          return [];
        }
      }
      throw err;
    }
  },

  async getById(id) {
    return await apiClient.get(`/categories/${id}`);
  },

  async search(name) {
    return await apiClient.get(`/categories/search?name=${encodeURIComponent(name)}`);
  },

  async create(name) {
    return await apiClient.post("/categories", { name });
  },

  async update(id, name) {
    return await apiClient.put(`/categories/${id}`, { name });
  },

  async delete(id) {
    return await apiClient.delete(`/categories/${id}`);
  },
};

export default categoriesApi;
