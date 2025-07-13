import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import type { Product } from "@/types";
import type { ApiError } from "@/utils";

export const PRODUCT_BY_ID_QUERY_KEY = (productId: string) => ["products", productId];

export const useProductByIdQuery = (productId: string | undefined) => {
  return useQuery<Product, ApiError>({
    queryKey: PRODUCT_BY_ID_QUERY_KEY(productId!),
    queryFn: () => productService.getProductById(productId!),
    enabled: !!productId, 
  });
};