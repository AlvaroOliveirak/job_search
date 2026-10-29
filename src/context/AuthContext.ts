// src/context/AuthContext.ts
import { createContext } from "react";

export interface User {
  name: string;
  email: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  toggleAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export default AuthContext;
