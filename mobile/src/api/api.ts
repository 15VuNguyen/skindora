import axios from "axios";
import { EXPO_PUBLIC_API_URL } from "@env";
import * as tokenService from "../services/tokenService";

const api = axios.create({
  baseURL: EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//Interceptor để tự động đính kèm token vào mỗi request
api.interceptors.request.use(
  async (config) => {
    const token = await tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//refreshToken khi gặp lỗi 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const is401 = error.response?.status === 401;
    const isNotRetry = !originalRequest._retry;

    if (is401 && isNotRetry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await tokenService.getRefreshToken();
        const res = await axios.post(
          `${EXPO_PUBLIC_API_URL}/users/refresh-token`, //Giả sử đây là refresh endpoint
          {
            refresh_token: refreshToken,
          }
        );
        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;
        await tokenService.saveTokens(newAccessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        await tokenService.clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
