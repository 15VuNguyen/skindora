import httpClient from "@/lib/axios";
import type { Brand } from "@/types/Filter/brand";

export interface FetchAllBrandProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
//get-all-filter-brand
export const fetchAllBrand = async (params: FetchAllBrandProps) => {
  return await httpClient
    .get<API.IResponseSearch<Brand>>("/admin/manage-filters/get-all-filter-brands", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//update-brand-status
export interface UpdateStateProps {
  id: string;
}
export const updateStatusBrand = async (params: UpdateStateProps, payload: { state: string }) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-brand-state/${params.id}`, payload)
    .then((response) => response.data);
};
//update-brand
export interface UpdateBrandProps {
  id: string;
  payload: Brand;
}
export const updateBrand = async (params: UpdateBrandProps) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-brand/${params.id}`, params.payload)
    .then((response) => response.data);
};
export interface getBrandByID {
  id: string;
}
//get-brand-by-id
export const getBrandByID = async (params: getBrandByID) => {
  return await httpClient
    .get<API.IResponseAPI>(`/admin/manage-filters/get-filter-brand-detail/${params.id}`)
    .then((response) => response.data);
};
