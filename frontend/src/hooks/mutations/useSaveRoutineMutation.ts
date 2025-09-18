import { useMutation } from "@tanstack/react-query";

import { routineService } from "@/services/routineService";

interface RoutinePayload {
  startDate: string;
  endDate: string;
  schedule: Record<string, { AM: string[]; PM: string[] }>;
}

export const useSaveRoutineMutation = () => {
  return useMutation({
    mutationFn: (payload: RoutinePayload) => {
      const result = routineService.saveUserRoutine(payload);
      if (!result) {
        throw new Error("Mutation failed unexpectedly.");
      }
      return result;
    },
  });
};
