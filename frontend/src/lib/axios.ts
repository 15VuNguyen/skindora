import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const HTTP_STATUS_TEXT = {
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Page Not Found",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  BAD_GATEWAY: "Bad Gateway",
  SERVICE_UNAVAILABLE: "Service Unavailable",
};

export class HttpClient {
  private createAxios: AxiosInstance;

  constructor(baseURL: string) {
    this.createAxios = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      timeout: 5000,
    });
    this.createAxios.interceptors.request.use((config) => {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken && !config.headers!.Authorization) {
        config.headers!.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });
    this.createAxios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (!error.response) {
          console.error("Network error or no response from server");
          return Promise.reject(error);
        }
        const status = error.response.status;
        switch (status) {
          case 401:
            localStorage.removeItem("access_token");
            console.log("API: 401 Unauthorized");
            break;
          case 403:
            console.log("API: 403 Forbidden");
            window.location.href = `/error/${HTTP_STATUS.FORBIDDEN}`;
            break;
          case 404:
            console.log("API: 404 Not Found");
            // window.location.href = `/error/${HTTP_STATUS.NOT_FOUND}`;
            break;
          case 500:
            console.log("API: 500 Internal Server Error");
            window.location.href = `/error/${HTTP_STATUS.INTERNAL_SERVER_ERROR}`;
            break;
          case 502:
            console.log("API: 502 Bad Gateway");
            break;
          case 503:
            console.log("API: 503 Server Unavailable");
            window.location.href = `/error/${HTTP_STATUS.SERVICE_UNAVAILABLE}`;
            break;
          default:
            console.error(`API Error: ${status}`);
          // window.location.href = `/error/${HTTP_STATUS.NOT_FOUND}`;
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: AxiosRequestConfig["params"]): Promise<AxiosResponse<T>> {
    return this.createAxios.get(url, {
      params: params ?? {},
    });
  }
  //axios.post(url[, data[, config]])
  async post<T>(
    url: string,
    data?: AxiosRequestConfig["data"],
    config?: AxiosRequestConfig<unknown> | undefined
  ): Promise<AxiosResponse<T>> {
    return this.createAxios.post(url, data, config);
  }
  //axios.put(url[, data[, config]])
  async put<T>(
    url: string,
    data?: AxiosRequestConfig["data"],
    config?: AxiosRequestConfig<unknown> | undefined
  ): Promise<AxiosResponse<T>> {
    return this.createAxios.put(url, data, config);
  }
  //axios.patch(url[, data[, config]])
  async patch<T>(
    url: string,
    data?: AxiosRequestConfig["data"],
    config?: AxiosRequestConfig<unknown> | undefined
  ): Promise<AxiosResponse<T>> {
    return this.createAxios.patch(url, data, config);
  }
  //axios.delete(url[, config])
  async delete<T>(url: string, params?: AxiosRequestConfig["params"]): Promise<AxiosResponse<T>> {
    return this.createAxios.delete(url, {
      params,
    });
  }
}

const httpClient = new HttpClient(import.meta.env.VITE_API_BASE_URL);

export default httpClient;
