import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { USER_PROFILE_QUERY_KEY } from "@/hooks/queries/useUserProfileQuery";
import { type UpdateMePayload, authService } from "@/services/authService";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateMePayload) => {
      const result = await authService.updateMe(payload);

      if (result.isErr()) {
        throw result.error;
      }

      return result.value.data;
    },

    onSuccess: () => {
      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },

    onError: (error) => {
      toast.error("Update Failed", {
        description: error.message || "Could not update profile.",
      });
    },
  });
};
