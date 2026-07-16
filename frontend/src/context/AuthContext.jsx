import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

const loadStoredUser = () => {
  try {
    const stored = localStorage.getItem("minimarthub-user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const loadStoredToken = () => {
  return localStorage.getItem("minimarthub-token") || null;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);
  const [token, setToken] = useState(loadStoredToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = loadStoredUser();
    const storedToken = loadStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });

    const { token: responseToken, user: responseUser } = response.data;

    if (!responseToken) {
      throw new Error("No token received from server");
    }

    localStorage.setItem("minimarthub-token", responseToken);
    localStorage.setItem("minimarthub-user", JSON.stringify(responseUser));

    setToken(responseToken);
    setUser(responseUser);

    return { user: responseUser, token: responseToken };
  }, []);

  const register = useCallback(async (name, email, phone, password) => {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      phone,
      password,
    });

    const { user: responseUser } = response.data;

    return { user: responseUser };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("minimarthub-token");
    localStorage.removeItem("minimarthub-user");
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem("minimarthub-user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const isAuthenticated = !!token && !!user;
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isSeller,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;