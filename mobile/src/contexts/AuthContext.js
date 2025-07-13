import React, { createContext, useState, useEffect } from "react";
import axios from "../utils/axiosPrivate";
import { authEndpoints, userEndpoints } from "../config/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../utils/tokenStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      const token = await getAccessToken();
      if (token) {
        setAccessToken(token);
        try {
          const { data } = await axios.get(userEndpoints.me, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(data.result);
        } catch (error) {
          console.log("Failed to fetch user", error);
          await clearTokens();
          setAccessToken(null);
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const handleAuthSuccess = async (tokens) => {
    await saveTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
    setAccessToken(tokens.access_token);
    const { data } = await axios.get(userEndpoints.me, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    setUser(data.result);
  };

  // Đăng nhập
  const login = async (loginData) => {
    const { data } = await axios.post(authEndpoints.login, loginData);
    console.log(data)
    await handleAuthSuccess(data.result);
  };

  const register = async (registerData) => {
    const { data } = await axios.post(authEndpoints.register, registerData);
    console.log(data)
    await handleAuthSuccess(data.result);
  };

  const googleLogin = async (code) => {
    const { data } = await axios.get(authEndpoints.loginGoogle(code));
    await handleAuthSuccess(data);
  };

  const logout = async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        await axios.post(authEndpoints.logout, { refresh_token: refreshToken });
      } catch (error) {
        console.error("Logout failed on server:", error);
      }
    }
    await clearTokens();
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
