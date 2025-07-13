import httpClient from "@/lib/axios";
import type { Size } from "@/types/Filter/size";

export interface FetchFilterSizeProps {
  limit?: number | string;
  page?: number | string;
}
//get-all-(filter_hsk_size)
export const fetchFilterSize = async (params: FetchFilterSizeProps) => {
  return await httpClient
    .get<API.IResponseSearch<Size>>("/admin/manage-filters/get-all-filter-hsk-sizes", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//create-(filter_hsk_size)
export const createFilterSize = async (payload: Size) => {
  return await httpClient
    .post("/admin/manage-filters/create-new-filter-size", payload)
    .then((response) => response.data);
};
//get-all-(filter_hsk_size)
export interface IDFilterSizeProps {
  id: string;
}
export const fetchFilterSizeByID = async (params: IDFilterSizeProps) => {
  return await httpClient
    .get<API.IResponseAPI>(`/admin/manage-filters/get-filter-hsk-size-detail/${params.id}`)
    .then((response) => response.data);
};
//update-(filter_hsk_size)
export const updateFilterSize = async (params: IDFilterSizeProps, payload: Size) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-size/${params.id}`, payload)
    .then((response) => response.data);
};
//update-status-(filter_hsk_size)
export const updateStatusFilterSize = async (params: IDFilterSizeProps, payload: { state: string }) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-size-state/${params.id}`, payload)
    .then((response) => response.data);
};
//search-by-name(filter_hsk_size)
export interface SearchProps {
  option_name: string;
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const searchByNameFilterSize = async (params: SearchProps) => {
  return await httpClient
    .get<API.IResponseSearch>("/admin/manage-filters/search-filter-hsk-size", {
      limit: params.limit,
      page: params.page,
      keyword: params.option_name,
    })
    .then((response) => response.data);
};
//get-active-(filter_hsk_size)
export const fetchFilterActiveSize = async () => {
  return await httpClient
    .get<API.IResponseAPI>("/admin/manage-filters/get-active-filter-hsk-sizes")
    .then((response) => response.data);
};
