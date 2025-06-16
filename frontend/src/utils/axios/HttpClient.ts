import type { AxiosError as AxiosErrorType, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { Result, err, ok } from "neverthrow";

import { ApiError } from "./error";
import type { ApiResponse, ExtendedAxiosRequestConfig, HttpClientConfig, HttpClientService, RequestOptions } from "./types";
import { logger } from "../logger";

export class HttpClient implements HttpClientService {
  private client: AxiosInstance;
  private config: HttpClientConfig;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];

  constructor(config: HttpClientConfig) {
    this.config = config;

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      const extendedConfig = config as ExtendedAxiosRequestConfig;

      if (!extendedConfig.skipAuth && this.config.auth?.tokenProvider) {
        const token = await this.config.auth.tokenProvider();
        if (token) {
          const tokenType = this.config.auth.tokenType || "Bearer";
          config.headers.set("Authorization", `${tokenType} ${token}`);
        }
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (this.config.DEBUG) {
          logger.debug(response);
        }
        return response;
      },
      async (error: AxiosErrorType) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        if (error.response?.status === 401 && this.config.auth?.refreshToken && originalRequest && !originalRequest.skipAuth && originalRequest._retry !== -1) {
          originalRequest._retry = -1;

          if (this.config.DEBUG) {
            logger.debug(" Encountered 401 error, attempting token refresh...", error);
          }
          if (this.isRefreshing) {
            try {
              return new Promise<AxiosResponse>((resolve, reject) => {
                this.addRefreshSubscriber((token) => {
                  if (token) {
                    if (originalRequest && originalRequest.headers) {
                      originalRequest.headers["Authorization"] = `${this.config.auth!.tokenType || "Bearer"} ${token}`;
                    }
                    this.client(originalRequest)
                      .then(resolve)
                      .catch((e) => reject(new ApiError(e as AxiosErrorType)));
                  } else {
                    reject(new ApiError(error));
                  }
                });
              });
            } catch (e) {
              logger.debug("Error while waiting for token refresh:", e);
              return Promise.reject(new ApiError(error));
            }
          } else {
            this.isRefreshing = true;

            try {
              const newToken = await this.config.auth.refreshToken();
              this.isRefreshing = false;

              if (newToken) {
                if (originalRequest.headers) {
                  originalRequest.headers["Authorization"] = `${this.config.auth.tokenType || "Bearer"} ${newToken}`;
                }
                this.onRefreshSuccess(newToken);
                return this.client(originalRequest);
              } else {
                this.onRefreshFailure();
                if (this.config.auth.onRefreshFailure) {
                  this.config.auth.onRefreshFailure();
                }
                return Promise.reject(new ApiError(error));
              }
            } catch (refreshError) {
              this.isRefreshing = false;
              this.onRefreshFailure();
              if (this.config.auth.onRefreshFailure) {
                this.config.auth.onRefreshFailure();
              }
              if (this.config.DEBUG) {
                logger.error(" Token refresh failed catastrophically:", refreshError);
              }
              return Promise.reject(new ApiError(error));
            }
          }
        }

        if (originalRequest && originalRequest._retry !== undefined && originalRequest._retry !== -1) {
          const maxRetries = originalRequest._maxRetries || this.config.defaultRetry?.maxRetries || 0;
          if (originalRequest._retry < maxRetries && this.shouldRetry(error)) {
            originalRequest._retry++;
            const delayMultiplier = originalRequest._delayMs || this.config.defaultRetry?.delayMs || 1000;
            const delay = delayMultiplier * Math.pow(2, originalRequest._retry - 1);
            if (this.config.DEBUG) {
              logger.warn(`Retrying request, attempt ${originalRequest._retry}/${maxRetries} after ${delay}ms...`, originalRequest.url);
            }
            await this.sleep(delay);
            return this.client(originalRequest);
          }
        }
        return Promise.reject(new ApiError(error));
      }
    );
  }

  private shouldRetry(error: AxiosErrorType): boolean {
    return !error.response || (error.response.status >= 500 && error.response.status <= 599);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private addRefreshSubscriber(callback: (token: string | null) => void): void {
    this.refreshSubscribers.push(callback);
  }

  private onRefreshSuccess(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private onRefreshFailure(): void {
    this.refreshSubscribers.forEach((callback) => callback(null));
    this.refreshSubscribers = [];
  }

  private async request<T>(method: string, url: string, data?: unknown, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>> {
    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      ...options,
    };

    if (data !== undefined) {
      requestConfig.data = data;
    }

    const extendedConfig = requestConfig as unknown as ExtendedAxiosRequestConfig;

    const retryConfig = options?.retry || this.config.defaultRetry;
    if (retryConfig) {
      logger.info(`Retry configuration: maxRetries=${retryConfig.maxRetries}, delayMs=${retryConfig.delayMs}`);
      extendedConfig._retry = 0;
      extendedConfig._maxRetries = retryConfig.maxRetries;
      extendedConfig._delayMs = retryConfig.delayMs;
    } else {
      extendedConfig._retry = -1;
    }

    if (options?.skipAuth) {
      extendedConfig.skipAuth = options.skipAuth;
    }

    try {
      const response: AxiosResponse<T> = await this.client(requestConfig);
      return ok({
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string | undefined>,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return err(error);
      }

      return err(new ApiError(error as AxiosErrorType));
    }
  }

  public async get<T>(url: string, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>> {
    return this.request<T>("GET", url, undefined, options);
  }

  public async post<T, D = unknown>(url: string, data?: D, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>> {
    return this.request<T>("POST", url, data, options);
  }

  public async put<T, D = unknown>(url: string, data?: D, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>> {
    return this.request<T>("PUT", url, data, options);
  }

  public async patch<T, D = unknown>(url: string, data?: D, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>> {
    return this.request<T>("PATCH", url, data, options);
  }

  public async delete<T>(url: string, options?: RequestOptions): Promise<Result<ApiResponse<T>, ApiError>> {
    return this.request<T>("DELETE", url, undefined, options);
  }
}
