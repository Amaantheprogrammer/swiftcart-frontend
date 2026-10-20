import axios from "axios";

// Unified Axios HTTP client with JWT handling, Refresh Token Rotation, and connection management
const STORAGE_KEY_TOKEN = "swiftcart_access_token";
const STORAGE_KEY_REFRESH = "swiftcart_refresh_token";
const STORAGE_KEY_CONFIG = "swiftcart_api_config";

export const DEFAULT_RENDER_BASE_URL = "https://e-commercebackendproject.onrender.com";

class ApiClient {
  constructor() {
    const savedConfig = this.getStoredConfig();
    this.baseUrl = savedConfig.baseUrl !== undefined ? savedConfig.baseUrl : DEFAULT_RENDER_BASE_URL;
    this.mode = savedConfig.mode || "render"; // 'render', 'local', 'custom'
    this.isBackendOnline = false;
    this.token = localStorage.getItem(STORAGE_KEY_TOKEN) || null;
    this.refreshToken = localStorage.getItem(STORAGE_KEY_REFRESH) || null;
    this.refreshPromise = null;
    this.listeners = new Set();

    // Create Axios Instance
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 300000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request Interceptor: Attach JWT Token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Handle Refresh Token Rotation & Error normalization
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized with Refresh Token rotation
        if (
          error.response &&
          error.response.status === 401 &&
          this.refreshToken &&
          originalRequest &&
          !originalRequest._isRetry &&
          !originalRequest.url?.includes("/auth/refresh") &&
          !originalRequest.url?.includes("/auth/sign-in")
        ) {
          originalRequest._isRetry = true;
          try {
            const newTokens = await this.rotateRefreshToken();
            if (newTokens?.accessToken) {
              originalRequest.headers["Authorization"] = `Bearer ${newTokens.accessToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch {
            this.clearTokens();
          }
        }

        // Format a user-friendly error message
        let errorMessage = "An unexpected network or server error occurred.";
        if (error.response?.data) {
          const data = error.response.data;
          errorMessage = data.message || data.error || (typeof data === "string" ? data : JSON.stringify(data));
        } else if (error.message) {
          errorMessage = error.message;
        }

        const normalizedError = new Error(errorMessage);
        normalizedError.status = error.response?.status;
        normalizedError.response = error.response;
        normalizedError.isNetworkError = !error.response;

        if (normalizedError.isNetworkError) {
          this.isBackendOnline = false;
          this.notifyListeners();
        }

        return Promise.reject(normalizedError);
      }
    );
  }

  getStoredConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CONFIG);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  saveConfig(config) {
    this.baseUrl = config.baseUrl !== undefined ? config.baseUrl : this.baseUrl;
    this.mode = config.mode !== undefined ? config.mode : this.mode;
    this.axiosInstance.defaults.baseURL = this.baseUrl;

    localStorage.setItem(
      STORAGE_KEY_CONFIG,
      JSON.stringify({
        baseUrl: this.baseUrl,
        mode: this.mode,
      })
    );
    this.notifyListeners();
  }

  setTokens(accessToken, refreshToken) {
    this.token = accessToken;
    if (accessToken) {
      localStorage.setItem(STORAGE_KEY_TOKEN, accessToken);
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }

    if (refreshToken !== undefined) {
      this.refreshToken = refreshToken;
      if (refreshToken) {
        localStorage.setItem(STORAGE_KEY_REFRESH, refreshToken);
      } else {
        localStorage.removeItem(STORAGE_KEY_REFRESH);
      }
    }
    this.notifyListeners();
  }

  clearTokens() {
    this.setTokens(null, null);
  }

  getTokens() {
    return {
      accessToken: this.token,
      refreshToken: this.refreshToken,
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener({
          baseUrl: this.baseUrl,
          mode: this.mode,
          isOnline: this.isBackendOnline,
          hasToken: !!this.token,
        });
      } catch (err) {
        console.error("Error in API listener:", err);
      }
    }
  }

  async checkHealth() {
    try {
      const response = await this.axiosInstance.get("/", {
        timeout: 6000,
      });

      this.isBackendOnline = response.status >= 200 && response.status < 400;
      this.notifyListeners();
      return { online: this.isBackendOnline, status: response.status };
    } catch (err) {
      this.isBackendOnline = false;
      this.notifyListeners();
      return { online: false, error: err.message };
    }
  }

  // Unified request method for convenience & backwards compatibility
  async request(endpoint, options = {}) {
    const method = (options.method || "GET").toLowerCase();
    const config = {
      url: endpoint,
      method,
      headers: {
        ...(options.headers || {}),
      },
      ...options,
    };

    if (options.body !== undefined && config.data === undefined) {
      config.data = options.body;
    }

    delete config.body;

    const response = await this.axiosInstance(config);
    return response.data;
  }

  // Direct Axios-style helper methods
  async get(endpoint, config = {}) {
    const response = await this.axiosInstance.get(endpoint, config);
    return response.data;
  }

  async post(endpoint, data = {}, config = {}) {
    const response = await this.axiosInstance.post(endpoint, data, config);
    return response.data;
  }

  async put(endpoint, data = {}, config = {}) {
    const response = await this.axiosInstance.put(endpoint, data, config);
    return response.data;
  }

  async patch(endpoint, data = {}, config = {}) {
    const response = await this.axiosInstance.patch(endpoint, data, config);
    return response.data;
  }

  async delete(endpoint, config = {}) {
    const response = await this.axiosInstance.delete(endpoint, config);
    return response.data;
  }

  async rotateRefreshToken() {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await axios.post(
          `${this.baseUrl}/auth/refresh`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.refreshToken}`,
            },
          }
        );

        if (response.data?.accessToken) {
          this.setTokens(response.data.accessToken, response.data.refreshToken);
          return response.data;
        }
        this.clearTokens();
        return null;
      } catch {
        this.clearTokens();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
