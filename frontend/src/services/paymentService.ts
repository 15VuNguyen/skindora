import type { Result } from "neverthrow";

import { apiClient } from "@/lib/apiClient";
import { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";
import { type RequestOptions } from "@/utils/axios/types";

import type { CheckoutPayload } from "./orders.service";

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
export interface PaymentRequestPayload extends CheckoutPayload {
  orderDetails?: any[];
  total?: number;
  amount?: number;
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
  createZaloPayOrder: (payload: PaymentRequestPayload): Promise<Result<ApiResponse<ZaloPayResponse>, ApiError>> => {
    return apiClient.post<ZaloPayResponse, PaymentRequestPayload>("/payment/zalopay", payload);
  },

  createVNPayUrl: (payload: PaymentRequestPayload): Promise<Result<ApiResponse<VNPayResponse>, ApiError>> => {
    return apiClient.post<VNPayResponse, PaymentRequestPayload>("/payment/vnpay", payload);
  },
  verifyVNPayReturn: (returnData: VNPayReturnData): Promise<Result<ApiResponse<VerificationResponse>, ApiError>> => {
    const options: RequestOptions = {
      params: returnData,
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    };
    return apiClient.get<VerificationResponse>("/payment/vnpay_return", options);
  },
};
