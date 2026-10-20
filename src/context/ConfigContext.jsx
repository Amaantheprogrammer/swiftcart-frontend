import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient, { DEFAULT_RENDER_BASE_URL } from "../api/client";

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => apiClient.getStoredConfig());
  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeUrl, setActiveUrl] = useState(apiClient.baseUrl || DEFAULT_RENDER_BASE_URL);
  const [mode, setMode] = useState(apiClient.mode || "render"); // 'render', 'local', 'custom'

  const checkConnection = useCallback(async () => {
    setChecking(true);
    const result = await apiClient.checkHealth();
    setIsOnline(result.online);
    setChecking(false);
    return result;
  }, []);

  const changeMode = useCallback((newMode, customUrl = "") => {
    let targetBaseUrl = DEFAULT_RENDER_BASE_URL;
    if (newMode === "local") {
      targetBaseUrl = "http://localhost:8080";
    } else if (newMode === "render") {
      targetBaseUrl = DEFAULT_RENDER_BASE_URL;
    } else if (newMode === "custom") {
      targetBaseUrl = customUrl;
    }

    setMode(newMode);
    setActiveUrl(targetBaseUrl);
    apiClient.saveConfig({ mode: newMode, baseUrl: targetBaseUrl });
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    const unsubscribe = apiClient.subscribe((state) => {
      setIsOnline(state.isOnline);
      setActiveUrl(state.baseUrl);
      setMode(state.mode);
    });

    checkConnection();

    // Periodic check every 45 seconds
    const interval = setInterval(checkConnection, 45000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [checkConnection]);

  return (
    <ConfigContext.Provider
      value={{
        isOnline,
        checking,
        activeUrl,
        mode,
        changeMode,
        checkConnection,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export default ConfigContext;
