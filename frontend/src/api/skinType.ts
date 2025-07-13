import httpClient from "@/lib/axios";
import type { SkinType } from "@/types/Filter/skinType";

export interface FetchFilterSizeProps {
  limit?: number | string;
  page?: number | string;
}
//get-all-(filter_hsk_skin_type)
export const fetchFilterSkin = async (params: FetchFilterSizeProps) => {
  return await httpClient
    .get<API.IResponseSearch<SkinType>>("/admin/manage-filters/get-all-filter-hsk-skin-types", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//create-(filter_hsk_skin_type)
export const createFilterSkin = async (payload: SkinType) => {
  return await httpClient
    .post("/admin/manage-filters/create-new-filter-hsk-skin-type", payload)
    .then((response) => response.data);
};
//get-all-(filter_hsk_skin_type)
export interface IDFilterSkinTypeProps {
  id: string;
}
export const fetchFilterSkinByID = async (params: IDFilterSkinTypeProps) => {
  return await httpClient
    .get<API.IResponseAPI>(`/admin/manage-filters/get-filter-hsk-skin-type-detail/${params.id}`)
    .then((response) => response.data);
};
//update-(filter_hsk_skin_type)
export const updateFilterSkin = async (params: IDFilterSkinTypeProps, payload: SkinType) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-skin-type/${params.id}`, payload)
    .then((response) => response.data);
};
//update-status-(filter_hsk_skin_type)
export const updateStatusFilterSkin = async (params: IDFilterSkinTypeProps, payload: { state: string }) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-skin-type-state/${params.id}`, payload)
    .then((response) => response.data);
};

//search-by-name(filter_hsk_skin_type)
export interface SearchProps {
  option_name: string;
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const searchByNameFilterSkin = async (params: SearchProps) => {
  return await httpClient
    .get<API.IResponseSearch>("/admin/manage-filters/search-filter-hsk-skin-type", {
      limit: params.limit,
      page: params.page,
      keyword: params.option_name,
    })
    .then((response) => response.data);
};
//get-active-(filter_hsk_size)
export const fetchFilterActiveSkin = async () => {
  return await httpClient
    .get<API.IResponseAPI>("/admin/manage-filters/get-active-filter-hsk-skin-types")
    .then((response) => response.data);
};
