import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { getRefreshToken } from "@/utils/tokenManager";


export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return Promise.resolve();
      return authService.logout(refreshToken);
    },
  });
};