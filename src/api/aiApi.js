import axios from "axios";

const STORAGE_KEY_AI_URL = "swiftcart_ai_url";
export const DEFAULT_AI_URL = "http://localhost:8000";

class AiApiClient {
  constructor() {
    this.baseUrl = this.getStoredUrl();
    this.isOnline = false;
    this.listeners = new Set();

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 120000, // 2 minutes for LLM generation
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  getStoredUrl() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AI_URL);
      return stored && stored.trim() ? stored.trim() : DEFAULT_AI_URL;
    } catch {
      return DEFAULT_AI_URL;
    }
  }

  setUrl(url) {
    const cleanUrl = url && url.trim() ? url.trim() : DEFAULT_AI_URL;
    this.baseUrl = cleanUrl;
    this.axiosInstance.defaults.baseURL = cleanUrl;
    try {
      localStorage.setItem(STORAGE_KEY_AI_URL, cleanUrl);
    } catch {
      // ignore storage errors
    }
    this.notifyListeners();
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
          isOnline: this.isOnline,
        });
      } catch (err) {
        console.error("Error in AI API listener:", err);
      }
    }
  }

  async checkHealth() {
    try {
      const response = await this.axiosInstance.get("/", { timeout: 5000 });
      const online = response.status >= 200 && response.status < 400 && response.data?.service === "swift-cart-ai";
      this.isOnline = online || response.status === 200;
      this.notifyListeners();
      return {
        online: this.isOnline,
        status: response.status,
        data: response.data,
      };
    } catch (err) {
      this.isOnline = false;
      this.notifyListeners();
      return {
        online: false,
        error: err.message || "AI Service unreachable",
      };
    }
  }

  async chat(message) {
    if (!message || !message.trim()) {
      throw new Error("Message cannot be empty");
    }

    try {
      const response = await this.axiosInstance.post("/ai/chat", {
        message: message.trim(),
      });
      return response.data; // { response: string }
    } catch (err) {
      if (!err.response) {
        throw new Error(
          `Unable to reach SwiftCart AI service at ${this.baseUrl}. Please verify the Python FastAPI server is running.`,
          { cause: err }
        );
      }
      const data = err.response.data;
      const detail = data?.detail || data?.message || err.message || "Failed to generate AI response.";
      throw new Error(detail, { cause: err });
    }
  }

  async getProducts(page = 0, size = 20) {
    try {
      const response = await this.axiosInstance.get("/products", {
        params: { page, size },
      });
      return response.data; // { count: number, products: [...] }
    } catch (err) {
      console.warn("Error fetching products from AI service:", err);
      return { count: 0, products: [] };
    }
  }

  async getProductById(id) {
    try {
      const response = await this.axiosInstance.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      console.warn(`Error fetching product ${id} from AI service:`, err);
      return null;
    }
  }
}

export const aiApi = new AiApiClient();
export default aiApi;
