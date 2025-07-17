import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { isAdministratorProfile } from "@/helper/JwtSecurityHelper";

export interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshAuthState: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const refreshAuthState = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsAdmin(token ? isAdministratorProfile() : false);
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    refreshAuthState();
  };

  const logout = () => {
    localStorage.removeItem("token");
    refreshAuthState();
  };

  useEffect(() => {
    // Vérifier l'état au montage
    refreshAuthState();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    isAdmin,
    login,
    logout,
    refreshAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
