import { useMutation } from "@tanstack/react-query";

import type { LoginFormData } from "@/schemas/authSchemas";
import { authService } from "@/services/authService";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginFormData) => authService.login(credentials),
  });
};
