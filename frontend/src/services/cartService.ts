import type { Result } from "neverthrow";

import { apiClient } from "@/lib/apiClient";
import type { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";

interface AddToCartPayload {
  ProductID: string;
  Quantity: number;
}

interface CartProduct {
  ProductID: string;
  Quantity: number;
  name: string;
  image: string;
  unitPrice: number;
  totalPrice: number;
}
interface CartData {
  Products: CartProduct[];
}

export interface CartAPIResponse {
  message: string;
  result: CartData;
}
export interface UpdateCartPayload {
  Quantity: number;
}
export interface AppliedVoucherResponse {
  message: string;
  result: {
    UserID: string;
    Products: any[];
    TotalPrice: number;
    CreatedAt: string;
    VoucherCode: string;
    DiscountAmount: number;
    FinalPrice: number;
  };
}
export const cartService = {
  addToCart: (payload: AddToCartPayload): Promise<Result<ApiResponse<CartAPIResponse>, ApiError>> => {
    return apiClient.post<CartAPIResponse, AddToCartPayload>("/carts", payload);
  },

  getCart: () => {
    return apiClient.get<CartAPIResponse>("/carts");
  },
  updateItemQuantity: (productId: string, quantity: number) => {
    return apiClient.patch<CartAPIResponse, UpdateCartPayload>(`/carts/${productId}`, { Quantity: quantity });
  },
  applyVoucher: (voucherCode: string) => {
    return apiClient.post<AppliedVoucherResponse, { voucherCode: string }>("/orders/apply-voucher", { voucherCode });
  },

  removeItem: (productId: string) => {
    return apiClient.delete<CartAPIResponse>(`/carts/${productId}`);
  },
  clearVoucher: () => {
    return apiClient.post("/orders/clear-voucher");
  },
  clearCart: (): Promise<Result<ApiResponse<CartAPIResponse>, ApiError>> => {
    return apiClient.delete<CartAPIResponse>("/carts");
  },
};
