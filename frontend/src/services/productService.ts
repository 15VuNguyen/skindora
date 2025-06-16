import { apiClient } from "@/lib/apiClient";
import type { PaginatedProductsResponse, ProductDetail } from "@/types";


export const productService = {
  
  getAllProducts: async ({ page = 1, limit = 12 }) => {
    const result = await apiClient.get<PaginatedProductsResponse>(`/products/get-all?page=${page}&limit=${limit}`);

    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data;
  },


  getProductById: async (productId: string): Promise<ProductDetail> => {
    const result = await apiClient.get<{ message: string; result: ProductDetail }>(`/products/${productId}`);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data.result;
  },
};
