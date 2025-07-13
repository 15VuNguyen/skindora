import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Result } from "neverthrow";
import { toast } from "sonner";

import { PREPARED_ORDER_QUERY_KEY } from "@/hooks/queries/usePreparedOrderQuery";
import { type CartAPIResponse, cartService } from "@/services/cartService";
import type { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";

import { CART_QUERY_KEY } from "../queries/useCartQuery";

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: (result: Result<ApiResponse<CartAPIResponse>, ApiError>) => {
      if (result.isOk()) {
        toast.success("Product added to cart!", {
          description: "You can view your cart at any time.",
        });
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: PREPARED_ORDER_QUERY_KEY });
      } else {
        toast.error("Failed to add to cart", {
           description: result.error.message || "Please log in and try again.",

          // description: "Please log in first",
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("Failed to add to cart", {
        description: error.message || "Please try again.",
      });
    },
  });
};
