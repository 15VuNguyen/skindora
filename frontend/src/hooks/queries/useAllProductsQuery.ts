import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/productService";

export const PRODUCTS_QUERY_KEY = (page: number, limit: number, filters: Record<string, string[]>,searchTerm? :string) => [
  "products",
  "all",
  { page, limit, filters,searchTerm },
];

export const useAllProductsQuery = (page: number, limit: number, filters: Record<string, string[]>,searchTerm?:string) => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY(page, limit, filters,searchTerm),
    queryFn: () => productService.getAllProducts({ page, limit, filters,q: searchTerm  }),
    placeholderData: (previousData) => previousData,
  });
};
