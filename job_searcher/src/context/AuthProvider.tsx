// src/context/AuthProvider.tsx
import React, { useState } from "react";
import { AuthContext, type User } from "./AuthContext";

const STORAGE_AUTH_KEY = "job_search_auth";

function extractNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] || "Candidato";
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Boolean(parsed.isLoggedIn);
      }
    } catch {
      // fallback
    }
    return false;
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.isLoggedIn && parsed.user) {
          return parsed.user;
        }
      }
    } catch {
      // fallback
    }
    return null;
  });

  const login = (email: string, name?: string) => {
    const finalName = name || extractNameFromEmail(email);
    const loggedUser: User = { email, name: finalName };
    setIsLoggedIn(true);
    setUser(loggedUser);
    localStorage.setItem(
      STORAGE_AUTH_KEY,
      JSON.stringify({ isLoggedIn: true, user: loggedUser })
    );
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem(STORAGE_AUTH_KEY);
  };

  const toggleAuth = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login("alvaro.oliveira@email.com", "Álvaro Oliveira");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
