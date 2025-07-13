import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";

export const PRODUCT_REVIEWS_QUERY_KEY = (productId: string) => ["reviews", productId];

export const useProductReviewsQuery = (productId: string | undefined) => {
  return useQuery({
    queryKey: PRODUCT_REVIEWS_QUERY_KEY(productId!),
    queryFn: () => reviewService.getReviewsForProduct(productId!),
    enabled: !!productId, 
    staleTime: 1000 * 60 * 5,
  });
};