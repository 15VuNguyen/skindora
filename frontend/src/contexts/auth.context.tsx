import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserProfileQuery } from "@/hooks/queries/useUserProfileQuery";
import { useAuthActions } from "@/hooks/useAuthActions";
import type { User } from "@/types";
import { getAccessToken, getGoogleAuthURL, logger } from "@/utils";
import { setTokens } from "@/utils";
import { mapBackendUserToFrontendUser } from "@/utils/userMappers";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  actions: ReturnType<typeof useAuthActions>;
  handleGoogleLogin: () => void;
  handleOAuthLogin: (params: { accessToken: string; refreshToken: string; newUserParam: string | null }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useState<boolean>(!!getAccessToken());
  const queryClient = useQueryClient();
  const { data: apiUser, isLoading: isUserLoading, isSuccess, isError } = useUserProfileQuery(hasToken);

  const handleOAuthLogin = useCallback(
    (params: { accessToken: string; refreshToken: string; newUserParam: string | null }) => {
      const { accessToken, refreshToken, newUserParam } = params;
      setTokens(accessToken, refreshToken);
      setHasToken(true);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      if (newUserParam === "1") {
        toast.success("Google account linked successfully!", { description: "Welcome to Skindora!" });
      } else {
        toast.success("Logged in successfully with Google!", { description: "Welcome back!" });
      }

      navigate("/");
    },
    [navigate, queryClient]
  );
  const actions = useAuthActions(setHasToken);

  useEffect(() => {
    const handleStorageChange = () => {
      setHasToken(!!getAccessToken());
    };
    const handleTokenRefreshed = () => {
      logger.info("Auth context caught token refresh event. Updating state.");
      setHasToken(true);
    };
    window.addEventListener("storage", handleStorageChange);
    const handleAuthFailure = () => setHasToken(false);
    window.addEventListener("auth:session_expired", handleAuthFailure);
    window.addEventListener("auth:token_refreshed", handleTokenRefreshed);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth:session_expired", handleAuthFailure);
      window.removeEventListener("auth:token_refreshed", handleTokenRefreshed);
    };
  }, []);

  useEffect(() => {
    if (isError && hasToken) {
      logger.info("session expired rui", {
        error: isError,
      });
      queryClient.clear();
      setHasToken(false);
    }
  }, [isError, hasToken, queryClient]);

  const value: AuthContextType = React.useMemo(() => {
    const user = apiUser ? mapBackendUserToFrontendUser(apiUser) : null;
    const isAuthenticated = !!user && isSuccess;

    return {
      user,
      isAuthenticated,
      isLoading: isUserLoading,
      actions,
      handleGoogleLogin: () => {
        window.location.href = getGoogleAuthURL();
      },
      handleOAuthLogin,
    };
  }, [apiUser, isUserLoading, isSuccess, actions, handleOAuthLogin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
