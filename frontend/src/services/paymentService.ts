import type { Result } from "neverthrow";

import { apiClient } from "@/lib/apiClient";
import { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";

export interface ZaloPayOrderItem {
  _id: string;
  ProductID: string;
  Quantity: number;
  Discount: number;
}

export interface ZaloPayPayload {
  orderDetails: ZaloPayOrderItem[];
  total: number;
}

export interface ZaloPayResponse {
  returncode: number;
  returnmessage: string;
  orderurl: string;
  zptranstoken: string;
}

export interface VNPayPayload {
  amount: number;
  bankCode?: string;
  language?: "vn" | "en";
  orderDescription?: string;
  orderType?: string;
}

export interface VNPayResponse {
  message: string;
  data: {
    paymentUrl: string;
  };
}
export interface VNPayReturnData {
  [key: string]: string | number;
}

export interface VerificationResponse {
  message: string;
  code: string; 
}
export const paymentService = {
  createZaloPayOrder: (payload: ZaloPayPayload): Promise<Result<ApiResponse<ZaloPayResponse>, ApiError>> => {
    return apiClient.post<ZaloPayResponse, ZaloPayPayload>("/payment/zalopay", payload);
  },

  createVNPayUrl: (payload: VNPayPayload): Promise<Result<ApiResponse<VNPayResponse>, ApiError>> => {
    return apiClient.post<VNPayResponse, VNPayPayload>("/payment/vnpay", payload);
  },
  verifyVNPayReturn: (returnData: VNPayReturnData): Promise<Result<ApiResponse<VerificationResponse>, ApiError>> => {
    return apiClient.post<VerificationResponse, VNPayReturnData>("/payment/vnpay_return", returnData);
  },
};
