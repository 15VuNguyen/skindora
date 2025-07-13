import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import type { ApiError } from "@/utils";
import type { Product } from "@/types";

export const WISHLIST_PRODUCTS_QUERY_KEY = ["wishlist", "products"];

export const useWishlistProductsQuery = (isAuthenticated: boolean) => {
  return useQuery<Product[], ApiError>({
    queryKey: WISHLIST_PRODUCTS_QUERY_KEY,
    queryFn: () => productService.getWishlistProducts(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, 
  });
};
