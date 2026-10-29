// src/context/AuthProvider.tsx
import React, { useState } from "react";
import { AuthContext, type User } from "./AuthContext";
import { apiRequest, setAuthToken, getAuthToken } from "../services/api";

const STORAGE_AUTH_KEY = "job_search_auth";

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    name: string;
    telegramChatId?: string | null;
  };
}

function extractNameFromEmail(email: string): string {
  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail.startsWith("alvarooliver")) {
    return "Alvaro Oliver";
  }
  const localPart = cleanEmail.split("@")[0] || "Candidato";
  const withoutNumbers = localPart.replace(/\d+$/, "");
  const parts = withoutNumbers.split(/[._-]+/).filter(Boolean);
  if (parts.length > 1) {
    return parts
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  const single = withoutNumbers || localPart;
  return single.charAt(0).toUpperCase() + single.slice(1).toLowerCase();
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => getAuthToken());

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

  const login = async (email: string, password?: string, name?: string): Promise<boolean> => {
    const cleanEmail = email.trim();

    // Se a senha foi informada, tenta autenticar diretamente na API do Spring Boot
    if (password) {
      try {
        const response = await apiRequest<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: cleanEmail, password }),
        });

        const loggedUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          telegramChatId: response.user.telegramChatId,
        };

        setAuthToken(response.access_token);
        setToken(response.access_token);
        setIsLoggedIn(true);
        setUser(loggedUser);

        localStorage.setItem(
          STORAGE_AUTH_KEY,
          JSON.stringify({ isLoggedIn: true, user: loggedUser })
        );

        return true;
      } catch (err: unknown) {
        const error = err as Error;
        console.warn("Falha no login com a API Spring Boot:", error.message);
        // Propaga o erro para o componente Login exibir para o usuário
        throw error;
      }
    }

    // Modo simulado / fallback quando nenhuma senha é passada (ex: login social fictício)
    const finalName = name || extractNameFromEmail(cleanEmail);
    const loggedUser: User = { email: cleanEmail, name: finalName };
    setIsLoggedIn(true);
    setUser(loggedUser);
    localStorage.setItem(
      STORAGE_AUTH_KEY,
      JSON.stringify({ isLoggedIn: true, user: loggedUser })
    );
    return true;
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim();

    if (password) {
      try {
        const response = await apiRequest<AuthResponse>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email: cleanEmail, password }),
        });

        const loggedUser: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          telegramChatId: response.user.telegramChatId,
        };

        setAuthToken(response.access_token);
        setToken(response.access_token);
        setIsLoggedIn(true);
        setUser(loggedUser);

        localStorage.setItem(
          STORAGE_AUTH_KEY,
          JSON.stringify({ isLoggedIn: true, user: loggedUser })
        );

        return true;
      } catch (err: unknown) {
        const error = err as Error;
        console.warn("Falha no cadastro com a API Spring Boot:", error.message);
        throw error;
      }
    }

    // Fallback sem senha
    return login(cleanEmail, undefined, name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_AUTH_KEY);
  };

  const toggleAuth = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login("alvarooliver1802@gmail.com", "123456", "Álvaro Oliveira");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, register, logout, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
