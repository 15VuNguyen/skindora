import { useMutation } from "@tanstack/react-query";
import type { RegisterFormData } from "@/schemas/authSchemas";
import { authService } from "@/services/authService";


export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterFormData) => authService.register(data),
  });
};