// src/context/AuthProvider.tsx
import React, { useState } from "react";
import { AuthContext, type User } from "./AuthContext";

const STORAGE_AUTH_KEY = "job_search_auth";

function extractNameFromEmail(email: string): string {
  const cleanEmail = email.toLowerCase().trim();

  // Caso especial para o usuário principal
  if (cleanEmail.startsWith("alvarooliver")) {
    return "Alvaro Oliver";
  }

  const localPart = cleanEmail.split("@")[0] || "Candidato";

  // Remove dígitos numéricos do final (ex: joao1234 -> joao)
  const withoutNumbers = localPart.replace(/\d+$/, "");

  // Se tiver separadores como ponto, hífen ou underscore
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
          const email = (parsed.user.email || "").toLowerCase();
          const currentName = parsed.user.name || "";
          // Corrige automaticamente sessões pré-existentes salvas no navegador
          if (email.includes("alvarooliver") && (currentName.includes("1802") || !currentName.includes(" "))) {
            const correctedUser = { ...parsed.user, name: "Alvaro Oliver" };
            localStorage.setItem(
              STORAGE_AUTH_KEY,
              JSON.stringify({ ...parsed, user: correctedUser })
            );
            return correctedUser;
          }
          return parsed.user;
        }
      }
    } catch {
      // fallback
    }
    return null;
  });

  const login = (email: string, name?: string) => {
    const cleanEmail = email.trim();
    let finalName = name || extractNameFromEmail(cleanEmail);

    if (cleanEmail.toLowerCase().includes("alvarooliver") && (finalName.includes("1802") || !finalName.includes(" "))) {
      finalName = "Alvaro Oliver";
    }

    const loggedUser: User = { email: cleanEmail, name: finalName };
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
