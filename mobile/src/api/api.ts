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

export default api;
