import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as tokenService from "../services/tokenService";
import api from "../api/api";

interface User {
  _id: string;
  first_name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  googleLogin: (code: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const token = await tokenService.getAccessToken();
      if (token) {
        setAccessToken(token);
        try {
          const { data } = await api.get("/users/me");
          setUser(data.result);
        } catch (error) {
          console.log("Failed to fetch user", error);
          await tokenService.clearTokens();
          setAccessToken(null);
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const handleAuthSuccess = async (tokens: {
    access_token: string;
    refresh_token: string;
  }) => {
    await tokenService.saveTokens(tokens.access_token, tokens.refresh_token);
    setAccessToken(tokens.access_token);
    const { data } = await api.get("/users/me");
    setUser(data.result);
  };

  const login = async (loginData: any) => {
    const { data } = await api.post("/users/login", loginData);
    await handleAuthSuccess(data.result);
  };

  const register = async (registerData: any) => {
    const { data } = await api.post("/users/register", registerData);
    await handleAuthSuccess(data.result);
  };

  const googleLogin = async (code: string) => {
    const { data } = await api.get(`/users/oauth/google?code=${code}`);
    await handleAuthSuccess(data);
  };

  const logout = async () => {
    const refreshToken = await tokenService.getRefreshToken();
    if (refreshToken) {
      try {
        await api.post("/users/logout", { refresh_token: refreshToken });
      } catch (error) {
        console.error("Logout failed on server:", error);
      }
    }
    await tokenService.clearTokens();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        register,
        logout,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
