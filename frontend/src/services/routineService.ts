import type { Result } from "neverthrow";

import { apiClient } from "@/lib/apiClient";
import type { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";

interface RoutinePayload {
  startDate: string;
  endDate: string;
  schedule: Record<string, { AM: string[]; PM: string[] }>;
}

interface RoutineApiResponse {
  message: string;
  result: unknown;
}

export const routineService = {
  saveUserRoutine: (payload: RoutinePayload): Promise<Result<ApiResponse<RoutineApiResponse>, ApiError>> => {
    return apiClient.post<RoutineApiResponse, RoutinePayload>("/users/me/routine", payload);
  },
};
