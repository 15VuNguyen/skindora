import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ordersService } from "@/services/orders.service";
import type { ApiError } from "@/utils";

import { ORDER_BY_ID_QUERY_KEY } from "../queries/useOrderByIdQuery";

export const useRequestCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      ordersService.requestCancelOrder(orderId, reason),
    onSuccess: (result, variables) => {
      if (result.isOk()) {
        toast.success("Cancellation Requested", {
          description: "Your request to cancel the order has been submitted.",
        });
        queryClient.invalidateQueries({ queryKey: ORDER_BY_ID_QUERY_KEY(variables.orderId) });
      } else {
        toast.error("Cancellation Failed", {
          description: result.error.message || "Could not request cancellation.",
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("Cancellation Failed", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
};
