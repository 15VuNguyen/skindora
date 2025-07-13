import type { Result } from "neverthrow";
import { apiClient } from "@/lib/apiClient";
import type { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";
import type { Review } from "@/types";

export interface AddReviewPayload {
  rating: number;
  comment: string;
  images?: string[];
  videos?: string[];
}

export const reviewService = {
  addReview: (
    orderId: string,
    productId: string,
    payload: AddReviewPayload
  ): Promise<Result<ApiResponse<{ message: string }>, ApiError>> => {
    return apiClient.post(`/review/${orderId}/products/${productId}/review`, payload);
  },

  getReviewsForProduct: async (productId: string): Promise<API.IResponseSearch<Review>> => {
    const result = await apiClient.get<API.IResponseSearch<Review>>(`/review/${productId}/review`);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data;
  },
};