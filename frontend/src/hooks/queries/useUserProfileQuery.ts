import { useQuery } from "@tanstack/react-query";

import { authService } from "@/services/authService";
import type { DetailedUserFromApi } from "@/services/authService";
import type { ApiError } from "@/utils/axios/error";

export const USER_PROFILE_QUERY_KEY = ["user", "me"];

const fetcher = async (): Promise<DetailedUserFromApi | null> => {
  const result = await authService.getMe();
  if (result.isOk()) {
    return result.value.data.result;
  }
  throw result.error;
};

export function useUserProfileQuery(isAuthenticated: boolean) {
  return useQuery<DetailedUserFromApi | null, ApiError, DetailedUserFromApi | null, typeof USER_PROFILE_QUERY_KEY>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: fetcher,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}
