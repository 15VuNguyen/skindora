import { useMutation } from "@tanstack/react-query";

import { type ResetPasswordFormData } from "@/schemas/authSchemas";
import { authService } from "@/services/authService";

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: ResetPasswordFormData }) =>
      authService.resetPassword(token, data),
  });
};
