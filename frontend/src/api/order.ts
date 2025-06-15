import httpClient from "@/lib/axios";
import type { Order } from "@/types/order";

export interface FetchListOrderProps {
  limit?: string | number;
  page?: string | number;
}
export const fetchListOrder = async (params: FetchListOrderProps) => {
  return await httpClient
    .get<API.IResponseSearch<Order>>(`/orders`, {
      params: params,
    })
    .then((response) => response.data);
};
