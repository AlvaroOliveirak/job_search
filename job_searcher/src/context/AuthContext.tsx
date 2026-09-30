import React, { createContext, useContext, useState } from "react";

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  toggleAuth: () => void;
}

const STORAGE_AUTH_KEY = "job_search_auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const formattedName = name || extractNameFromEmail(email);
    const userData: User = {
      email,
      name: formattedName || "Álvaro Oliveira",
    };
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem(
      STORAGE_AUTH_KEY,
      JSON.stringify({ isLoggedIn: true, user: userData })
    );
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.setItem(
      STORAGE_AUTH_KEY,
      JSON.stringify({ isLoggedIn: false, user: null })
    );
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
};

export default AuthContext;
