// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../context/AuthContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
};

export default useAuth;
