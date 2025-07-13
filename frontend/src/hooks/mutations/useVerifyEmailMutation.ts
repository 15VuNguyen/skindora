import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";


export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
};