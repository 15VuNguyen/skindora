import { useMutation,  } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewService, type AddReviewPayload } from "@/services/reviewService";
import type { ApiError } from "@/utils";

export const useAddReviewMutation = () => {
//   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, productId, payload }: { orderId: string; productId: string; payload: AddReviewPayload }) =>
      reviewService.addReview(orderId, productId, payload),
    onSuccess: (result) => {
      if (result.isOk()) {
        toast.success("Review Submitted!", {
          description: "Thank you for your feedback.",
        });
        // queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      } else {
        toast.error("Submission Failed", {
          description: result.error.message || "Could not submit your review.",
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("Submission Failed", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
};