import httpClient from "@/lib/axios";
import type { Order } from "@/types/order";

export interface FetchListOrderProps {
  limit?: string | number;
  page?: string | number;
  status?: "SHIPPING" | "FAILED" | "CANCELLED" | "RETURNED" | "DELIVERED" | "PROCESSING" | "ALL";
  totalPages?: string | number;
  totalRecords?: number;
}
export interface UpdateStatusOrderProps {
  orderID: string;
}
export const fetchListOrder = async (params: FetchListOrderProps) => {
  return await httpClient
    .get<API.IResponseSearch<Order>>(`/orders`, {
      limit: params.limit,
      page: params.page,
      status: params.status,
    })
    .then((response) => response.data);
};
export const updateStatusOrder = async (params: UpdateStatusOrderProps) => {
  return await httpClient
    .patch<API.IUpdateStatusOrder>(`/orders/${params.orderID}/next-status`)
    .then((response) => response.data);
};
