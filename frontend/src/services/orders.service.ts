import type { Result } from "neverthrow";

import { apiClient } from "@/lib/apiClient";
import type { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";
export interface UserInOrder {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  username: string;
  phone_number: string;
  avatar: string;
}

export interface OrderData {
  _id: string;
  User: UserInOrder;
  ShipAddress: string;

    DiscountValue: string;
  Description: string;
  RequireDate: string;
  PaymentMethod: string;
  PaymentStatus: string;
  Status: OrderStatus;
  TotalPrice: string;
  created_at: string;
  updated_at: string;
  CancelRequest?: {
    status: "REQUESTED" | "APPROVED" | "REJECTED";
    reason: string;
    requestedAt: string;
    staffId: string | null;
  };
  VoucherSnapshot?: {
    code: string;
    discountType: string;
    discountValue: string;
    maxDiscountAmount: string;
  };
}
export interface OrderByIdResponse {
  message: string;
  result: {
    order: OrderData;
    orderDetail: MyOrderDetail[];
  };
}
export interface BuyNowPayload {
  productId: string;
  quantity: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED"
  | "FAILED";
export interface CheckoutPayload {
  ShipAddress: string;
  Description?: string;
  RequireDate: string;
  PaymentMethod: "COD" | "ZALOPAY" | "VNPAY";
  PaymentStatus: "UNPAID" | "PAID";
  Discount?: string;
  type: "cart" | "buy-now";
voucherCode?: string; 
}
export interface MyOrderDetailProduct {
  productId: string;
  name: string;
  image: string;
  price: string;
}

export interface MyOrderDetail {
  _id: string;
  Quantity: string;
  OrderDate: string;
  UnitPrice: string;
  Products: MyOrderDetailProduct;
}

export interface MyOrder {
  orderId: string;
    TotalPrice: string; 
  OrderDate: string; 
  
  orderDetail: MyOrderDetail[];
  orderStatus: OrderStatus;
}

export interface MyOrdersApiResponse {
  message: string;
  result: MyOrder[];
}
export interface ProductInOrder {
  ProductID: string;
  Quantity: number;
  PricePerUnit: number;
  TotalPrice: number;
  Name: string;
  image: string;
}

export interface PreparedOrder {
  UserID: string;
  Products: ProductInOrder[];
  TotalPrice: number;
  CreatedAt: string;
  VoucherCode?: string;
  DiscountAmount?: number;
  FinalPrice?: number;
}

export interface PreparedOrderResponse {
  message: string;
  result: PreparedOrder;
}

export interface CreatedOrderResponse {
  message: string;
  result: {
    UserID: string;
    ShipAddress: string;
    Description: string;
    RequireDate: string;
    Discount: string;
    TotalPrice: string;
    PaymentMethod: "COD" | "ZALOPAY" | "VNPAY";
    PaymentStatus: "UNPAID" | "PAID";
    Status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    orderDetails: Array<{
      ProductID: string;
      OrderID: string;
      Quantity: string;
      OrderDate: string;
      UnitPrice: string;
    }>;
  };
}

export const ordersService = {
  buyNow: (payload: BuyNowPayload): Promise<Result<ApiResponse<PreparedOrderResponse>, ApiError>> => {
    return apiClient.post<PreparedOrderResponse, BuyNowPayload>("/orders/buy-now", payload);
  },
  getPreparedOrder: (): Promise<Result<ApiResponse<PreparedOrderResponse>, ApiError>> => {
    return apiClient.get<PreparedOrderResponse>("/orders/current");
  },

  prepareOrderFromCart: (
    selectedProductIDs: string[]
  ): Promise<Result<ApiResponse<PreparedOrderResponse>, ApiError>> => {
    return apiClient.post<PreparedOrderResponse, { selectedProductIDs: string[] }>("/orders/cart", {
      selectedProductIDs,
    });
  },
  getMyOrders: (): Promise<Result<ApiResponse<MyOrdersApiResponse>, ApiError>> => {
    return apiClient.get<MyOrdersApiResponse>("/orders/me");
  },

  createOrder: (payload: CheckoutPayload): Promise<Result<ApiResponse<CreatedOrderResponse>, ApiError>> => {
    return apiClient.post<CreatedOrderResponse, CheckoutPayload>("/orders/checkout", payload);
  },
  getOrderById: (orderId: string): Promise<Result<ApiResponse<OrderByIdResponse>, ApiError>> => {
    return apiClient.get<OrderByIdResponse>(`/orders/${orderId}`);
  },
  requestCancelOrder: (
    orderId: string,
    reason: string
  ): Promise<Result<ApiResponse<{ message: string }>, ApiError>> => {
    return apiClient.post<{ message: string }, { reason: string }>(`/orders/${orderId}/cancel-request`, { reason });
  },
};
