import httpClient from "@/lib/axios";
import type { Order } from "@/types/order";

export interface FetchListOrderProps {
  limit?: string | number;
  page?: string | number;
}
export const fetchListOrder = async (params: FetchListOrderProps) => {
  return await httpClient
    .get<API.IResponseSearch<Order>>(`/orders`, {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
