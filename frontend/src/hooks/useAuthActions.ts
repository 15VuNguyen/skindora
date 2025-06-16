import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { LoginFormData, RegisterFormData } from "@/schemas/authSchemas";
import { logger } from "@/utils";
import { clearTokens, setTokens } from "@/utils/tokenManager";

import { useLoginMutation } from "./mutations/useLoginMutation";
import { useLogoutMutation } from "./mutations/useLogoutMutation";
import { useRegisterMutation } from "./mutations/useRegisterMutation";
import { useVerifyEmailMutation } from "./mutations/useVerifyEmailMutation";

export const useAuthActions = (setHasToken: React.Dispatch<React.SetStateAction<boolean>>) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const verifyEmailMutation = useVerifyEmailMutation();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

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
    [registerMutation, queryClient, setHasToken]
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
  return {
    login,
    isLoggingIn: loginMutation.isPending,
    register,
    isRegistering: registerMutation.isPending,
    logout,
    isLoggingOut: logoutMutation.isPending,
    verifyEmail,
    isVerifyingEmail: verifyEmailMutation.isPending,
  };
};
