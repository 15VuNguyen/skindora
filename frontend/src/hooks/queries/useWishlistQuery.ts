import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/productService";
import type { ApiError } from "@/utils";

export const WISHLIST_QUERY_KEY = ["wishlist", "currentUser"];

export const useWishlistQuery = (isAuthenticated: boolean) => {
  return useQuery<string[], ApiError>({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: () => productService.getWishlist(),
    enabled: isAuthenticated, 
    staleTime: 1000 * 60 * 5, 
  });
};
