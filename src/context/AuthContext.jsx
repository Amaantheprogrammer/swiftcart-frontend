import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authApi from "../api/authApi";
import usersApi from "../api/usersApi";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize or restore session from valid token
  const initUser = useCallback(async () => {
    const { accessToken } = apiClient.getTokens();
    if (accessToken) {
      try {
        const profile = await usersApi.getMyUser();
        setUser(profile);
      } catch {
        // Token invalid or expired and refresh failed
        apiClient.clearTokens();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initUser();
  }, [initUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await authApi.signIn(email, password);
      // Fetch user profile from live backend
      const profile = await usersApi.getMyUser();
      setUser(profile);
      return profile;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await authApi.signUp(userData);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.signOut();
    } finally {
      setUser(null);
      apiClient.clearTokens();
    }
  };

  const updateProfile = async (updateData) => {
    const updated = await usersApi.updateMyUser(updateData);
    setUser(updated);
    return updated;
  };

  const deleteAccount = async () => {
    await usersApi.deleteMyUser();
    await logout();
  };

  const role = user?.role || "GUEST";
  const isAuthenticated = !!user;
  const isAdmin = role === "ROLE_ADMIN";
  const isSeller = role === "ROLE_SELLER" || role === "ROLE_ADMIN";
  const isUser = role === "ROLE_USER";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isSeller,
        isUser,
        role,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
