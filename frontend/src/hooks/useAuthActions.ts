import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { LoginFormData, RegisterFormData, ResetPasswordFormData } from "@/schemas/authSchemas";
import { logger } from "@/utils";
import { clearTokens, setTokens } from "@/utils/tokenManager";

import { useForgotPasswordMutation } from "./mutations/useForgotPasswordMutation";
import { useLoginMutation } from "./mutations/useLoginMutation";
import { useLogoutMutation } from "./mutations/useLogoutMutation";
import { useRegisterMutation } from "./mutations/useRegisterMutation";
import { useResetPasswordMutation } from "./mutations/useResetPasswordMutation";
import { useVerifyEmailMutation } from "./mutations/useVerifyEmailMutation";
import { authService } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
export const useAuthActions = (setHasToken: React.Dispatch<React.SetStateAction<boolean>>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const verifyEmailMutation = useVerifyEmailMutation();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
   const changePasswordMutation = useMutation({
      mutationFn: ({ oldPassword, newPassword ,confirm_password}: { oldPassword: string, newPassword: string ,confirm_password:string}) => 
          authService.changePassword(oldPassword, newPassword,confirm_password)
  });
    const changePassword = useCallback(
    (oldPassword: string, newPassword: string,confirm_password:string) => {
      return new Promise((resolve, reject) => {
        changePasswordMutation.mutate(
          { oldPassword, newPassword,confirm_password },
          {
            onSuccess: (result) => {
              if (result.isOk()) {
                resolve(result.value);
              } else {
                reject(result.error);
              }
            },
            onError: (error) => {
              reject(error);
            },
          }
        );
      });
    },
    [changePasswordMutation]
  );
  const login = useCallback(
    (credentials: LoginFormData) => {
      loginMutation.mutate(credentials, {
        onSuccess: (result) => {
          if (result.isOk()) {
            const { access_token, refresh_token } = result.value.data.result;

            setTokens(access_token, refresh_token);
            setHasToken(true);
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
            toast.success("Login Successful", { description: "Welcome back!" });
          } else {
            toast.error("Login Failed", { description: result.error.message });
          }
        },
        onError: (error) => {
          toast.error("Login Failed", { description: error.message });
        },
      });
    },
    [loginMutation, queryClient, setHasToken]
  );

  const register = useCallback(
    (data: RegisterFormData) => {
      registerMutation.mutate(data, {
        onSuccess: (result) => {
          if (result.isOk()) {
            const { access_token, refresh_token } = result.value.data.result;
            setTokens(access_token, refresh_token);
            setHasToken(true);
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
            toast.success("Registration Successful", { description: "Your account has been created." });
            navigate("/", { replace: true }); 
          } else {
            toast.error("Registration Failed", { description: result.error.message });
          }
        },
        onError: (error) => {
          logger.debug("Registration Error", error);
          toast.error("Registration Failed", { description: error.message });
        },
      });
    },
    [registerMutation, queryClient, setHasToken,navigate]
  );

  const verifyEmail = useCallback(
    (token: string) => {
      verifyEmailMutation.mutate(token, {
        onSuccess: (result) => {
          if (result.isOk()) {
            const { access_token, refresh_token } = result.value.data.result;
            setTokens(access_token, refresh_token);
            setHasToken(true);
            queryClient.invalidateQueries({ queryKey: ["user", "me"] });
            toast.success("Email Verified Successfully!", {
              description: "You have been logged in. Welcome to Skindora!",
            });
            navigate("/");
          } else {
            toast.error("Verification Failed", { description: result.error.message });
            navigate("/auth/login");
          }
        },
        onError: (error) => {
          toast.error("Verification Failed", { description: error.message });
          navigate("/auth/login");
        },
      });
    },
    [verifyEmailMutation, queryClient, navigate, setHasToken]
  );
  const logout = useCallback(() => {
    clearTokens();
    setHasToken(false);
    queryClient.clear();
    navigate("/auth/login");
    toast.info("Logged Out", {
      description: "You have been successfully logged out.",
    });

    logoutMutation.mutate();
  }, [logoutMutation, queryClient, navigate, setHasToken]);
  const forgotPassword = useCallback(
    (data: { email: string }) => {
      forgotPasswordMutation.mutate(data, {
        onSuccess: (result) => {
          if (result.isOk()) {
            toast.success("Reset Link Sent", {
              description: "Please check your email for instructions to reset your password.",
            });
          } else {
            toast.error("Request Failed", { description: result.error.message });
          }
        },
        onError: (error) => {
          toast.error("Request Failed", { description: error.message });
        },
      });
    },
    [forgotPasswordMutation]
  );

  const resetPassword = useCallback(
    (token: string, data: ResetPasswordFormData) => {
      resetPasswordMutation.mutate(
        { token, data },
        {
          onSuccess: (result) => {
            if (result.isOk()) {
              toast.success("Password Reset Successfully", {
                description: "You can now log in with your new password.",
              });
              navigate("/auth/login");
            } else {
              toast.error("Reset Failed", { description: result.error.message });
            }
          },
          onError: (error) => {
            toast.error("Reset Failed", { description: error.message });
          },
        }
      );
    },
    [resetPasswordMutation, navigate]
  );
  return {
    login,
    isLoggingIn: loginMutation.isPending,
    register,
    isRegistering: registerMutation.isPending,
    logout,
    isLoggingOut: logoutMutation.isPending,
    verifyEmail,
    isVerifyingEmail: verifyEmailMutation.isPending,
    forgotPassword,
    isRequestingReset: forgotPasswordMutation.isPending,
    resetPassword,
    isResettingPassword: resetPasswordMutation.isPending,
    changePassword,
    isChangingPassword: changePasswordMutation.isPending,
  };
};
