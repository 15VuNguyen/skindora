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

export interface UserRoutine {
  _id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  schedule: Record<string, { AM?: string[]; PM?: string[] }>;
  created_at?: string;
  updated_at?: string;
}

interface UserRoutineApiResponse {
  message: string;
  result: UserRoutine;
}

export const routineService = {
  saveUserRoutine: (payload: RoutinePayload): Promise<Result<ApiResponse<RoutineApiResponse>, ApiError>> => {
    return apiClient.post<RoutineApiResponse, RoutinePayload>("/users/me/routine", payload);
  },
  getUserRoutine: (): Promise<Result<ApiResponse<UserRoutineApiResponse>, ApiError>> => {
    return apiClient.get<UserRoutineApiResponse>("/users/me/routine");
  },
};
