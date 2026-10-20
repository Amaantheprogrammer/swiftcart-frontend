import apiClient from "./client";

export const authApi = {
  async signIn(email, password) {
    const data = await apiClient.post("/auth/sign-in", {
      email,
      password,
    });
    if (data?.accessToken) {
      apiClient.setTokens(data.accessToken, data.refreshToken);
    }
    return data;
  },

  async signUp({ name, email, password, paymentMethod, role, address }) {
    return await apiClient.post("/auth/sign-up", {
      name,
      email,
      password,
      paymentMethod,
      role,
      address,
    });
  },

  async signOut() {
    try {
      await apiClient.post("/auth/sign-out");
    } catch {
      // Ignore network errors on sign out
    } finally {
      apiClient.clearTokens();
    }
  },

  async refresh() {
    return await apiClient.rotateRefreshToken();
  },
};

export default authApi;
