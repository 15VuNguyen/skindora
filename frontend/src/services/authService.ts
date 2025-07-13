import { apiClient } from "@/lib/apiClient";
import type { LoginFormData, RegisterFormData, ResetPasswordFormData } from "@/schemas/authSchemas";

interface AuthResponse {
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
    user?: "user" | "admin" | "staff";
  };
}
export interface UpdateMePayload {
  first_name?: string;
  last_name?: string;
  username?: string;
  location?: string;
  avatar?: string;
}
interface UpdateUserResponse {
  message: string;
  result: DetailedUserFromApi | null;
}
export interface DetailedUserFromApi {
  _id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role?: "USER" | "ADMIN" | "STAFF";
  username?: string;
  avatar?: string;
  verify?: string;
  roleid?: string;
  phone_number?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserProfileResponse {
  message: string;
  result: DetailedUserFromApi | null;
}
interface UserProfileResponse {
  message: string;
  result: DetailedUserFromApi | null;
}

export const authService = {
  login: async (credentials: LoginFormData) => {
    return apiClient.post<AuthResponse, LoginFormData>("/users/login", credentials, { skipAuth: true });
  },

  register: async (data: RegisterFormData) => {
    const { ...registerData } = data;
    return apiClient.post<AuthResponse, RegisterFormData>("/users/register", registerData, {
      skipAuth: true,
    });
  },

  logout: async (refreshToken: string) => {
    return apiClient.post<{ message: string }, { refresh_token: string }>("/users/logout", {
      refresh_token: refreshToken,
    });
  },

  updateMe: async (payload: UpdateMePayload) => {
    return apiClient.patch<UpdateUserResponse, UpdateMePayload>("/users/me", payload);
  },
  resendVerificationEmail: async () => {
    return apiClient.post<{ message: string }>("/users/resend-verify-email", {});
  },
  forgotPassword: (data: { email: string }) => {
    return apiClient.post<{ message: string }, { email: string }>("/users/forgot-password", data, {
      skipAuth: true,
    });
  },
  changePassword: (oldPassword: string, newPassword: string,confirm_password:string) => {
    return apiClient.put<{ message: string }, { old_password: string; password: string,confirm_password:string }>(
      "/users/change-password",
      {
        old_password: oldPassword,
        password: newPassword,
        confirm_password:confirm_password
      }
    );
  },
  resetPassword: (token: string, data: ResetPasswordFormData) => {
    return apiClient.post<{ message: string }, { forgot_password_token: string; password: string,confirm_password:string }>(
      "/users/reset-password",
      {
        forgot_password_token: token,
        password: data.password,
        confirm_password:data.confirmPassword
      },
      { skipAuth: true }
    );
  },

  getMe: async () => {
    return apiClient.get<UserProfileResponse>("/users/me");
  },
  verifyEmail: async (token: string) => {
    return apiClient.post<AuthResponse>("/users/verify-email", { email_verify_token: token }, { skipAuth: true });
  },
};
