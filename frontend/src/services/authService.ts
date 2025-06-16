import { apiClient } from "@/lib/apiClient";
import type {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
} from "@/schemas/authSchemas";

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

  forgotPassword: async (data: ForgotPasswordFormData) => {
    return apiClient.post<{ message: string }, ForgotPasswordFormData>("/users/forgot-password", data, {
      skipAuth: true,
    });
  },
  updateMe: async (payload: UpdateMePayload) => {
    return apiClient.patch<UpdateUserResponse, UpdateMePayload>("/users/me", payload);
  },
  resendVerificationEmail: async () => {
    return apiClient.post<{ message: string }>("/users/resend-verify-email", {});
  },
  resetPassword: async (token: string, data: ResetPasswordFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    const { confirmPassword, ...resetData } = data;
    return apiClient.post<{ message: string }, Omit<ResetPasswordFormData, "confirmPassword">>(
      `/users/reset-password?forgot_password_token=${token}`,
      resetData,
      { skipAuth: true }
    );
  },

  getMe: async () => {
    return apiClient.get<UserProfileResponse>("/users/me");
  },
  verifyEmail: async (token: string) => {
    return apiClient.post<AuthResponse>(
      "/users/verify-email", 
      { email_verify_token: token }, 
      { skipAuth: true } 
    );
  },
};
