import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/productService";

export const PRODUCTS_QUERY_KEY = (page: number, limit: number) => ["products", "all", { page, limit }];


export const useAllProductsQuery = (page: number, limit: number) => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY(page, limit),
    queryFn: () => productService.getAllProducts({ page, limit }),
    placeholderData: (previousData) => previousData,
  });
};
