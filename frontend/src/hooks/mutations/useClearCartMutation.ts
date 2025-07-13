
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cartService } from "@/services/cartService";
import type { ApiError } from "@/utils";

import { CART_QUERY_KEY } from "../queries/useCartQuery";

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (result) => {
      if (result.isOk()) {
        toast.success("Cart Cleared", {
          description: "All items have been removed from your cart.",
        });
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      } else {
        toast.error("Failed to clear cart", {
          description: result.error.message || "Please try again later.",
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("Failed to clear cart", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
};