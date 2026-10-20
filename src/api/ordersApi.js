import apiClient from "./client";

export const ordersApi = {
  async getAll(page = 0, size = 10) {
    const data = await apiClient.get(`/orders?page=${page}&size=${size}`);
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

  async getById(orderId) {
    return await apiClient.get(`/orders/${orderId}`);
  },

  async getMyOrders() {
    try {
      const data = await apiClient.get("/orders/me");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        return [];
      }
      throw err;
    }
  },

  async getByUserId(userId) {
    return await apiClient.get(`/orders/user/${userId}`);
  },

  async placeOrder({ productId, quantity, address, accountNumber }) {
    return await apiClient.post("/orders/place-order", {
      productId: Number(productId),
      quantity: Number(quantity),
      address: address || undefined,
      accountNumber: accountNumber || undefined,
    });
  },

  async placeOrderFromCart() {
    return await apiClient.post("/orders/cart/place-order");
  },

  async cancelOrder(orderId) {
    return await apiClient.patch(`/orders/${orderId}/cancel`);
  },

  async updateOrderStatus(orderId, orderStatus) {
    return await apiClient.patch(`/orders/${orderId}/order-status`, { orderStatus });
  },

  async updatePaymentStatus(orderId, paymentStatus) {
    return await apiClient.patch(`/orders/${orderId}/payment-status`, { paymentStatus });
  },
};

export default ordersApi;
