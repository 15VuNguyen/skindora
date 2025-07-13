import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { Voucher } from "@/types/voucher";
import type { ApiError } from "@/utils";

export const VOUCHERS_QUERY_KEY = ["vouchers", "currentUser"];

const fetchVouchers = async (): Promise<PaginatedResponse<Voucher>> => {
  const result = await apiClient.get<PaginatedResponse<Voucher>>("/users/vouchers");
  if (result.isErr()) {
    throw result.error;
  }
  return result.value.data;
};

export const useVouchersQuery = (isAuthenticated: boolean) => {
  return useQuery<PaginatedResponse<Voucher>, ApiError>({
    queryKey: VOUCHERS_QUERY_KEY,
    queryFn: fetchVouchers,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 15, 
  });
};
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
}