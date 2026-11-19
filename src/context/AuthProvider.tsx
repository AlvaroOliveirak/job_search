// src/context/AuthProvider.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type User } from "./AuthContext";
import { apiRequest, setAuthToken, getAuthToken, setUnauthorizedHandler } from "../services/api";

// Dados públicos do usuário logado (nunca a senha). O token JWT fica em "job_search_token" (api.ts).
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

// Caches por usuário: sem limpar, a próxima conta herda o perfil e as vagas da anterior
function clearUserCaches(): void {
  localStorage.removeItem("job_search_user_profile");
  localStorage.removeItem("job_search_matches");
  localStorage.removeItem("job_search_last_updated");
}

function readStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_AUTH_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.user?.email) {
        return parsed.user as User;
      }
    }
  } catch {
    // JSON corrompido: trata como deslogado
  }
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Restauração da sessão após F5: token + dados públicos do usuário salvos no login
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  // Só está logado quem tem token E usuário (sessões antigas da AV1, sem token, não contam)
  const isLoggedIn = Boolean(token && user);

  const startSession = (response: AuthResponse) => {
    clearUserCaches();

    const loggedUser: User = {
      id: response.user.id,
      email: response.user.email,
      name: response.user.name,
      telegramChatId: response.user.telegramChatId,
    };

    setAuthToken(response.access_token);
    setToken(response.access_token);
    setUser(loggedUser);
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify({ isLoggedIn: true, user: loggedUser }));
  };

  // A senha só existe no corpo deste POST; nada dela é guardado
  const login = async (email: string, password: string): Promise<void> => {
    const response = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    });
    startSession(response);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const response = await apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email: email.trim(), password }),
    });
    startSession(response);
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_AUTH_KEY);
    clearUserCaches();
  }, []);

  // Qualquer 401 vindo de uma rota protegida encerra a sessão e leva ao login
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      navigate("/login", { replace: true, state: { reason: "expired" } });
    });
    return () => setUnauthorizedHandler(null);
  }, [logout, navigate]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
