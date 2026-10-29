// src/context/AuthContext.ts
import { createContext } from "react";

export interface User {
  id?: number;
  name: string;
  email: string;
  telegramChatId?: string | null;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password?: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  toggleAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;
