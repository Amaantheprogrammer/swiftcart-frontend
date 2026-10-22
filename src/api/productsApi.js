import apiClient from "./client";

export const productsApi = {
  async getAll(page = 0, size = 12, sort = "id,desc") {
    const data = await apiClient.get(`/products?page=${page}&size=${size}&sort=${sort}`);
    // If backend returns a Spring Page object or direct List
    if (Array.isArray(data)) {
      return {
        content: data,
        totalElements: data.length,
        totalPages: Math.ceil(data.length / size),
        number: page,
        size,
      };
    }
    return data;
  },

  async getById(id) {
    return await apiClient.get(`/products/${id}`);
  },

  async getMyProducts() {
    return await apiClient.get("/products/me");
  },

  async search(name, price) {
    let query = `/products/search?name=${encodeURIComponent(name || "")}`;
    if (price !== undefined && price !== null && price !== "") {
      query += `&price=${price}`;
    }
    return await apiClient.get(query);
  },

  async getByCategory(categoryId, price) {
    let query = `/products/category/${categoryId}`;
    if (price !== undefined && price !== null && price !== "") {
      query += `?price=${price}`;
    }
    return await apiClient.get(query);
  },

  async create(productData) {
    return await apiClient.post("/products", productData);
  },

  async update(id, updateData) {
    return await apiClient.patch(`/products/${id}`, updateData);
  },

  async addImage(id, imageUrl) {
    return await apiClient.post(`/products/${id}/image`, { imageUrl });
  },

  async updateImage(id, imageId, imageUrl) {
    return await apiClient.put(`/products/${id}/image/${imageId}`, { imageUrl });
  },

  async deleteImage(id, imageId) {
    return await apiClient.delete(`/products/${id}/image/${imageId}`);
  },

  async delete(id) {
    return await apiClient.delete(`/products/${id}`);
  },

  async approve(id) {
    return await apiClient.put(`/products/${id}/approve`);
  },

  async getPending(page = 0, size = 20) {
    const data = await apiClient.get(`/products/pending?page=${page}&size=${size}`);
    if (Array.isArray(data)) return { content: data, totalElements: data.length, totalPages: 1 };
    return data;
  },

  async getAllAdmin(page = 0, size = 20) {
    const data = await apiClient.get(`/products/admin?page=${page}&size=${size}`);
    if (Array.isArray(data)) return { content: data, totalElements: data.length, totalPages: 1 };
    return data;
  },
};

export default productsApi;
