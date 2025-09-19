import { useQuery } from "@tanstack/react-query";

import { routineService, type UserRoutine } from "@/services/routineService";
import type { ApiError } from "@/utils/axios/error";

export const USER_ROUTINE_QUERY_KEY = ["user", "routine"] as const;

const fetchUserRoutine = async (): Promise<UserRoutine | null> => {
  const result = await routineService.getUserRoutine();
  if (result.isOk()) {
    return result.value.data.result;
  }

  if (result.error.status === 404) {
    return null;
  }

  throw result.error;
};

export const useUserRoutineQuery = (enabled = true) => {
  return useQuery<UserRoutine | null, ApiError>({
    queryKey: USER_ROUTINE_QUERY_KEY,
    queryFn: fetchUserRoutine,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
