import axios from "axios";
import { logger } from "@/utils";
import { config } from "@/config/config";
import { HttpClient } from "@/utils/axios/HttpClient";
import type { HttpClientConfig } from "@/utils/axios/types";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/utils/tokenManager";

const API_BASE_URL = config.apiBaseUrl || "http://localhost:4000";

const refreshTokenFn = async (): Promise<string | null> => {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) {
    logger.warn("No refresh token available to attempt refresh.");
    return null;
  }

  try {
    logger.info("Attempting to refresh access token...");
    const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
      refresh_token: currentRefreshToken,
    });

    const { access_token, refresh_token: newRefreshToken } = response.data.result;
    if (access_token && newRefreshToken) {
      setTokens(access_token, newRefreshToken);
      logger.info("Access token refreshed successfully.");
      window.dispatchEvent(new CustomEvent("auth:token_refreshed"));
      return access_token;
    } else {
      logger.error("Refresh token response did not contain new tokens.");
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth:session_expired"));
      return null;
    }
  } catch (error) {
    logger.error("Could not refresh token in refreshTokenFn:", error);
    clearTokens();
    window.dispatchEvent(new CustomEvent("auth:session_expired"));
    return null;
  }
};

const apiClientConfig: HttpClientConfig = {
  baseURL: API_BASE_URL,
  auth: {
    tokenProvider: async () => getAccessToken(),
    refreshToken: refreshTokenFn,

    onRefreshFailure: () => {
      logger.warn("Token refresh failed definitively. Clearing tokens and notifying app.");
      clearTokens();
      // redirect auth/infoin authcontext
      window.dispatchEvent(new CustomEvent("auth:session_expired"));
    },
    tokenType: "Bearer",
  },
  timeout: 60000,
  DEBUG: import.meta.env.DEV,
  defaultRetry: {
    maxRetries: 3,
    delayMs: 1000,
  },
};

export const apiClient = new HttpClient(apiClientConfig);
