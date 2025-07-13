import httpClient from "@/lib/axios";
import type { Uses } from "@/types/Filter/uses";

export interface FetchFilterUsesProps {
  limit?: number | string;
  page?: number | string;
}
//get-all-(filter_hsk_uses)
export const fetchFilterUses = async (params: FetchFilterUsesProps) => {
  return await httpClient
    .get<API.IResponseSearch<Uses>>("/admin/manage-filters/get-all-filter-hsk-uses", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//create-(filter_hsk_uses)
export const createFilterUses = async (payload: Uses) => {
  return await httpClient
    .post("/admin/manage-filters/create-new-filter-hsk-uses", payload)
    .then((response) => response.data);
};
//get-all-(filter_hsk_uses)
export interface IDFilterUsesProps {
  id: string;
}
export const fetchFilterUsesByID = async (params: IDFilterUsesProps) => {
  return await httpClient
    .get<API.IResponseAPI>(`/admin/manage-filters/get-filter-hsk-uses-detail/${params.id}`)
    .then((response) => response.data);
};
//update-(filter_hsk_uses)
export const updateFilterUses = async (params: IDFilterUsesProps, payload: Uses) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-uses/${params.id}`, payload)
    .then((response) => response.data);
};
//update-status-(filter_hsk_uses)
export const updateStatusFilterUses = async (params: IDFilterUsesProps, payload: { state: string }) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-uses-state/${params.id}`, payload)
    .then((response) => response.data);
};
//search-by-name(filter_hsk_uses)
export interface SearchProps {
  option_name: string;
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const searchByNameFilterUses = async (params: SearchProps) => {
  return await httpClient
    .get<API.IResponseSearch>("/admin/manage-filters/search-filter-hsk-uses", {
      limit: params.limit,
      page: params.page,
      keyword: params.option_name,
    })
    .then((response) => response.data);
};
//get-active-(filter_hsk_uses)
export const fetchFilterActiveUses = async () => {
  return await httpClient
    .get<API.IResponseAPI>("/admin/manage-filters/get-active-filter-hsk-uses")
    .then((response) => response.data);
};
