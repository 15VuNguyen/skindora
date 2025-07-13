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
//get-active-(filter_brand)
// export const fetchFilterActiveBrand = async () => {
//   return await httpClient.get("/admin/manage-filters/get-active-filter-brands").then((response) => response.data);
// };
export const fetchFilterActiveBrand = async () => {
  return await httpClient
    .get<API.IResponseAPI>("/admin/manage-filters/get-active-filter-brands")
    .then((response) => response.data);
};
//search-by-name(filter_brand)
export interface SearchProps {
  option_name: string;
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const searchByNameFilterBrand = async (params: SearchProps) => {
  return await httpClient
    .get<API.IResponseSearch>("/admin/manage-filters/search-filter-brand", {
      limit: params.limit,
      page: params.page,
      keyword: params.option_name,
    })
    .then((response) => response.data);
};
