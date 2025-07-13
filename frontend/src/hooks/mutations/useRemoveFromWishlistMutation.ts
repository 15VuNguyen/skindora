import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WISHLIST_PRODUCTS_QUERY_KEY } from "../queries/useWishlistProductsQuery";
import { productService } from "@/services/productService";
import type { ApiError } from "@/utils";

import { WISHLIST_QUERY_KEY } from "../queries/useWishlistQuery";

export const useRemoveFromWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productIds: string[]) => productService.removeFromWishlist(productIds),
    onSuccess: () => {
      toast.info("Removed from your wishlist.");
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: WISHLIST_PRODUCTS_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error("Could not remove from wishlist", {
        description: error.message || "Please try again later.",
      });
    },
  });
};
