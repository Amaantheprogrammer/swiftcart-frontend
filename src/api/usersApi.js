import apiClient from "./client";

export const usersApi = {
  async getAll(email) {
    let query = "/users";
    if (email) {
      query += `?email=${encodeURIComponent(email)}`;
    }
    return await apiClient.get(query);
  },

  async getById(id) {
    return await apiClient.get(`/users/${id}`);
  },

  async getMyUser() {
    return await apiClient.get("/users/me");
  },

  async updateMyUser({ name, email, paymentMethod }) {
    return await apiClient.patch("/users", { name, email, paymentMethod });
  },

  async deleteMyUser() {
    return await apiClient.delete("/users");
  },
};

export default usersApi;
