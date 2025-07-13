import httpClient from "@/lib/axios";
import type { Origin } from "@/types/Filter/origin";

export interface FetchFilterOriginProps {
  limit?: number | string;
  page?: number | string;
}
//get-all-(filter_hsk_origin)
export const fetchFilterOrigin = async (params: FetchFilterOriginProps) => {
  return await httpClient
    .get<API.IResponseSearch<Origin>>("/admin/manage-filters/get-all-filter-hsk-origins", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//create-(filter_hsk_origin)
export const createFilterOrigin = async (payload: Origin) => {
  return await httpClient
    .post("/admin/manage-filters/create-new-filter-hsk_origin", payload)
    .then((response) => response.data);
};
//get-all-(filter_hsk_origin)_by_id
export interface IDFilterOriginProps {
  id: string;
}
export const fetchFilterOriginByID = async (params: IDFilterOriginProps) => {
  return await httpClient
    .get<API.IResponseAPI>(`/admin/manage-filters/get-filter-hsk-origin-detail/${params.id}`)
    .then((response) => response.data);
};
//update-(filter_hsk_origin)
export const updateFilterOrigin = async (params: IDFilterOriginProps, payload: Origin) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-origin/${params.id}`, payload)
    .then((response) => response.data);
};
//update-status-(filter_hsk_origin)
export const updateStatusFilterOrigin = async (params: IDFilterOriginProps, payload: { state: string }) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-origin-state/${params.id}`, payload)
    .then((response) => response.data);
};
//search-by-name(filter_hsk_origin)
export interface SearchProps {
  option_name: string;
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const searchByNameFilterOrigin = async (params: SearchProps) => {
  return await httpClient
    .get<API.IResponseSearch>("/admin/manage-filters/search-filter-hsk-origin", {
      limit: params.limit,
      page: params.page,
      keyword: params.option_name,
    })
    .then((response) => response.data);
};
//get-active-(filter_hsk_origin)
export const fetchFilterActiveOrigin = async () => {
  return await httpClient
    .get<API.IResponseAPI>("/admin/manage-filters/get-active-filter-hsk-origins")
    .then((response) => response.data);
};
