import httpClient from "@/lib/axios";
import type { CancelRequest } from "@/types/cancelRequest";

export interface FetchAllCancelProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
//get-all-cancel-request
export const fetchCancelRequest = async (params: FetchAllCancelProps) => {
  return httpClient
    .get<API.IResponseSearch<CancelRequest>>("/orders/cancel", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//approve order cancellation
export interface ApproveCancelRequest {
  id: string;
}
export const approveCancelRequest = async (params: ApproveCancelRequest) => {
  return httpClient.patch(`/orders/${params.id}/cancel-request/approve`).then((response) => response.data);
};
//reject order cancellation
export interface RejectCancelRequest {
  id: string;
}
export const rejectCancelRequest = async (params: RejectCancelRequest) => {
  return httpClient.patch(`/orders/${params.id}/cancel-request/reject`).then((response) => response.data);
};
