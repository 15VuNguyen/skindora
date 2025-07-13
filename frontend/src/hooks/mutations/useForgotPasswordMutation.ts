import { useMutation } from "@tanstack/react-query";

import { type ForgotPasswordFormData } from "@/schemas/authSchemas";
import { authService } from "@/services/authService";

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authService.forgotPassword(data),
  });
};
