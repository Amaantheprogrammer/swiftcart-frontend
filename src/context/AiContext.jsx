import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import aiApi, { DEFAULT_AI_URL } from "../api/aiApi";
import productsApi from "../api/productsApi";

const AiContext = createContext(null);

const STORAGE_KEY_MESSAGES = "swiftcart_ai_chat_messages";

const INITIAL_GREETING = {
  id: "greeting-msg",
  role: "assistant",
  content:
    "👋 Hello! I'm **SwiftCart AI**, your personal shopping assistant.\n\nI can help you:\n- 🔍 **Discover & compare** catalog products\n- 💰 **Find bargains** within your exact budget\n- 🎯 **Check availability**, specifications, and recommendations\n\nHow can I help you shop today?",
  timestamp: new Date().toISOString(),
  products: [],
};

export const AiProvider = ({ children }) => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAiOnline, setIsAiOnline] = useState(false);
  const [aiUrl, setAiUrlState] = useState(() => aiApi.baseUrl || DEFAULT_AI_URL);
  const [catalogCache, setCatalogCache] = useState([]);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore parse error
    }
    return [INITIAL_GREETING];
  });

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch {
      // ignore storage error
    }
  }, [messages]);

  // Check AI service connection
  const checkHealth = useCallback(async () => {
    const res = await aiApi.checkHealth();
    setIsAiOnline(res.online);
    return res;
  }, []);

  // Pre-load a lightweight catalog cache for client-side card linking
  useEffect(() => {
    productsApi
      .getAll(0, 50)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        setCatalogCache(list);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const unsubscribe = aiApi.subscribe((state) => {
      setIsAiOnline(state.isOnline);
      setAiUrlState(state.baseUrl);
    });

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [checkHealth]);

  const updateAiUrl = useCallback((newUrl) => {
    aiApi.setUrl(newUrl);
    setAiUrlState(newUrl);
    checkHealth();
  }, [checkHealth]);

  // Extract products mentioned in text from catalog cache
  const matchProductsInText = useCallback((text, catalog) => {
    if (!text || !catalog || catalog.length === 0) return [];
    const matched = [];
    const lower = text.toLowerCase();

    for (const prod of catalog) {
      if (!prod.name) continue;
      const prodName = prod.name.toLowerCase();
      // Match if product name appears as substring or product ID is referenced as #ID
      const idPattern = new RegExp(`(#|id\\s*:?\\s*)${prod.id}\\b`, "i");
      if (lower.includes(prodName) || idPattern.test(text)) {
        if (!matched.some((m) => m.id === prod.id)) {
          matched.push(prod);
        }
      }
      if (matched.length >= 4) break; // at most 4 product cards
    }

    return matched;
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text || !text.trim() || isSending) return;

      const userMsgId = `user-${Date.now()}`;
      const userMessage = {
        id: userMsgId,
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);

      try {
        const result = await aiApi.chat(text.trim());
        const assistantText = result?.response || "I apologize, but I could not formulate a response.";

        // Match any catalog products referenced in the response
        const matched = matchProductsInText(assistantText, catalogCache);

        const assistantMsg = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: assistantText,
          timestamp: new Date().toISOString(),
          products: matched,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsAiOnline(true);
      } catch (err) {
        const errorMsg = {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ **Unable to communicate with SwiftCart AI**: ${err.message}\n\n*Target: \`${aiUrl}\`. If using Render cloud deployment, the service may be waking up from sleep. Please try sending your query again in a few seconds.*`,
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsAiOnline(false);
      } finally {
        setIsSending(false);
      }
    },
    [isSending, catalogCache, matchProductsInText, aiUrl]
  );

  const askAboutProduct = useCallback(
    (product) => {
      if (!product) return;
      setIsAiOpen(true);
      const prompt = `Tell me more about "${product.name}" ($${Number(product.price).toFixed(2)}, Category: ${product.categoryName || "Marketplace"}). What are its key highlights, why should I purchase it, and what alternatives do you recommend?`;
      sendMessage(prompt);
    },
    [sendMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([INITIAL_GREETING]);
  }, []);

  const toggleAi = useCallback(() => {
    setIsAiOpen((prev) => !prev);
  }, []);

  const openAi = useCallback(() => {
    setIsAiOpen(true);
  }, []);

  const closeAi = useCallback(() => {
    setIsAiOpen(false);
  }, []);

  return (
    <AiContext.Provider
      value={{
        isAiOpen,
        setIsAiOpen,
        toggleAi,
        openAi,
        closeAi,
        messages,
        isSending,
        isAiOnline,
        aiUrl,
        updateAiUrl,
        checkHealth,
        sendMessage,
        askAboutProduct,
        clearMessages,
      }}
    >
      {children}
    </AiContext.Provider>
  );
};

export const useAi = () => {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error("useAi must be used within an AiProvider");
  }
  return context;
};

export default AiContext;
