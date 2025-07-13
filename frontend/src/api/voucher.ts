import type { VoucherUpdate } from "@/hooks/Voucher/useUpdateVoucher";
import httpClient from "@/lib/axios";
import type { Voucher } from "@/types/voucher";

export interface FetchVoucherListProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
  code?: string;
}
export interface ToggleStatusProps {
  id: string;
}
export interface FetchVoucherByID {
  voucherId: string;
}
export interface UpdateVoucherProps {
  voucherId: string;
}
export const fetchListVoucher = async (params: FetchVoucherListProps) => {
  return await httpClient
    .get<API.IResponseSearch<Voucher>>("/admin/manage-vouchers/get-all", {
      limit: params.limit,
      page: params.page,
      code: params.code,
    })
    .then((res) => res.data);
};
export const toggleStatus = async (params: ToggleStatusProps) => {
  return await httpClient.put(`/admin/manage-vouchers/${params.id}/status`).then((response) => response.data);
};
export const UpdateVoucher = async (params: FetchVoucherListProps) => {
  return await httpClient
    .get<API.IResponseSearch<Voucher>>("/admin/manage-vouchers/get-all", {
      limit: params.limit,
      page: params.page,
    })
    .then((res) => res.data);
};
export const fetchVoucherByID = async (params: FetchVoucherByID) => {
  return await httpClient
    .get<API.IResponseAPI<Voucher>>(`/admin/manage-voucher/${params.voucherId}`)
    .then((response) => response.data);
};

export const updateVoucher = async (params: UpdateVoucherProps, payload: Voucher | VoucherUpdate) => {
  return httpClient
    .put<API.IResponseAPI<Voucher>>(`/admin/manage-vouchers/${params.voucherId}`, payload)
    .then((response) => response.data);
};
