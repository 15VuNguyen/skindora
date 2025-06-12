import { Result, err, ok } from "neverthrow";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuthActionHandlers } from "@/hooks/useAuthActionHandlers";
import type { LoginFormData, RegisterFormData } from "@/schemas/authSchemas";
import { authService } from "@/services/authService";
import type { DetailedUserFromApi } from "@/services/authService";
import type { User } from "@/types/auth";
import type { ApiError } from "@/utils/axios/error";
import { getGoogleAuthURL } from "@/utils/googleURL";
import { clearTokens, getAccessToken, getRefreshToken } from "@/utils/tokenManager";
import { mapBackendUserToFrontendUser } from "@/utils/userMappers";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<Result<User, ApiError>>;
  register: (data: RegisterFormData) => Promise<Result<User, ApiError>>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<Result<User, ApiError>>;
  handleGoogleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (): Promise<Result<User, ApiError>> => {
    const currentAccessToken = getAccessToken();
    if (!currentAccessToken) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return err({ name: "AuthError", message: "No access token found.", status: 401, data: {} } as ApiError);
    }
    setIsLoading(true);
    const response = await authService.getMe();
    if (response.isOk()) {
      if (response.value.data.result) {
        const backendUserData = response.value.data.result as DetailedUserFromApi;
        const frontendUser = mapBackendUserToFrontendUser(backendUserData);
        setUser(frontendUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return ok(frontendUser);
      } else {
        clearTokens();
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return err({ name: "ProfileError", message: "User profile data not found...", status: 404 } as ApiError);
      }
    } else {
      if (response.error.status === 401) {
        clearTokens();
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
      return err(response.error);
    }
  }, []);

  const { resetAuthStatesOnError, handleSuccessfulInitialAuth, handleInitialAuthFailure } = useAuthActionHandlers({
    fetchUserProfile,
    setUser,
    setIsAuthenticated,
    setIsLoading,
  });

  useEffect(() => {
    if (getAccessToken()) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
    const handleAuthFailure = () => {
      toast.error("Session Expired", { description: "Please log in again." });
      resetAuthStatesOnError();
      navigate("/auth/login");
    };
    window.addEventListener("auth:session_expired", handleAuthFailure);
    window.addEventListener("auth:refresh_failed", handleAuthFailure);
    return () => {
      window.removeEventListener("auth:session_expired", handleAuthFailure);
      window.removeEventListener("auth:refresh_failed", handleAuthFailure);
    };
  }, [fetchUserProfile, navigate, resetAuthStatesOnError, setIsLoading]);

  const login = useCallback(
    async (credentials: LoginFormData): Promise<Result<User, ApiError>> => {
      setIsLoading(true);
      const loginResponse = await authService.login(credentials);

      if (loginResponse.isOk()) {
        return handleSuccessfulInitialAuth(
          {
            access_token: loginResponse.value.data.result.access_token,
            refresh_token: loginResponse.value.data.result.refresh_token,
          },
          {
            successTitle: "Login Successful",
            successDescription: "Welcome back!",
            profileFetchErrorDefault: "Could not retrieve user details.",
          },
          (role) => (role === "ADMIN" ? "/admin" : role === "STAFF" ? "/staff" : "/profile")
        );
      } else {
        return handleInitialAuthFailure(loginResponse.error, {
          errorTitle: "Login Failed",
          errorDescriptionDefault: "Invalid credentials.",
        });
      }
    },
    [setIsLoading, handleSuccessfulInitialAuth, handleInitialAuthFailure]
  );

  const register = useCallback(
    async (data: RegisterFormData): Promise<Result<User, ApiError>> => {
      setIsLoading(true);
      const registerResponse = await authService.register(data);

      if (registerResponse.isOk()) {
        return handleSuccessfulInitialAuth(
          {
            access_token: registerResponse.value.data.result.access_token,
            refresh_token: registerResponse.value.data.result.refresh_token,
          },
          {
            successTitle: "Registration Successful",
            successDescription: "Welcome! Your account has been created.",
            profileFetchErrorDefault: "Please try logging in.",
          },
          () => "/profile"
        );
      } else {
        return handleInitialAuthFailure(registerResponse.error, {
          errorTitle: "Registration Failed",
          errorDescriptionDefault: "Could not create account.",
        });
      }
    },
    [setIsLoading, handleSuccessfulInitialAuth, handleInitialAuthFailure]
  );

  const handleGoogleLogin = useCallback(() => {
    const googleAuthURL = getGoogleAuthURL();
    if (googleAuthURL) {
      window.location.href = googleAuthURL;
    } else {
      toast.error("Google Login Error", { description: "Configuration error, cannot initiate Google Login." });
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    const currentToken = getRefreshToken();
    if (currentToken) {
      await authService.logout(currentToken);
    }
    resetAuthStatesOnError();
    toast.info("Logged Out", { description: "You have been successfully logged out." });
    navigate("/auth/login");
  }, [navigate, resetAuthStatesOnError, setIsLoading]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout, fetchUserProfile, handleGoogleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
