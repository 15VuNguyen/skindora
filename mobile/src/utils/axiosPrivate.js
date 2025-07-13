// utils/axiosPrivate.js
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "./tokenStorage";
import { authEndpoints } from "../config/api";
import publicAxios from "./axiosPublic";

const privateAxios = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

privateAxios.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

privateAxios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const is401 = error.response?.status === 401;
    const isNotRetry = !originalRequest._retry;

    if (is401 && isNotRetry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        const res = await publicAxios.post(authEndpoints.refresh, {
          refresh_token: refreshToken,
        });

        const tokens = res?.data?.result;
        const access_token = tokens?.access_token;
        const refresh_token = tokens?.refresh_token;

        if (access_token && refresh_token) {
          await saveTokens({
            accessToken: access_token,
            refreshToken: refresh_token,
          });
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return privateAxios(originalRequest);
        } else {
          throw new Error("Invalid refresh token response structure");
        }
      } catch (err) {
        console.log(
          "Refresh token failed:",
          err?.response?.data || err.message
        );
        await clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default privateAxios;
