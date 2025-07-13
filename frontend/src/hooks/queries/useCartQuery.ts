import { useQuery } from "@tanstack/react-query";

import { cartService } from "@/services/cartService";
import type { CartAPIResponse } from "@/services/cartService";
import type { ApiError } from "@/utils";

export const CART_QUERY_KEY = ["cart", "currentUser"];

export const useCartQuery = (enabled: boolean) => {
  return useQuery<CartAPIResponse, ApiError>({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const result = await cartService.getCart();

      if (result.isErr()) {
        throw result.error;
      }

      return result.value.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: enabled,
  });
};
