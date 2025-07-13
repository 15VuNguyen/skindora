import httpClient from "@/lib/axios";
import type { Ingredient } from "@/types/Filter/ingredient";

export interface FetchFilterIngredientProps {
  limit?: number | string;
  page?: number | string;
}
//get-all-(filter_hsk_ingredient)
export const fetchFilterIngredient = async (params: FetchFilterIngredientProps) => {
  return await httpClient
    .get<API.IResponseSearch<Ingredient>>("/admin/manage-filters/get-all-filter-hsk-ingredients", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//create-(filter_hsk_ingredient)
export const createFilterIngredient = async (payload: Ingredient) => {
  return await httpClient
    .post("/admin/manage-filters/create-new-filter-hsk-ingredient", payload)
    .then((response) => response.data);
};
//get-all-(filter_hsk_ingredient)_by_id
export interface IDFilterIngredientProps {
  id: string;
}
export const fetchFilterIngredientByID = async (params: IDFilterIngredientProps) => {
  return await httpClient
    .get<API.IResponseAPI>(`/admin/manage-filters/get-filter-hsk-ingredient-detail/${params.id}`)
    .then((response) => response.data);
};
//update-(filter_hsk_ingredient)
export const updateFilterIngredient = async (params: IDFilterIngredientProps, payload: Ingredient) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-ingredient/${params.id}`, payload)
    .then((response) => response.data);
};
//update-status-(filter_hsk_ingredient)
export const updateStatusFilterIngredient = async (params: IDFilterIngredientProps, payload: { state: string }) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-ingredient-state/${params.id}`, payload)
    .then((response) => response.data);
};
//search-by-name(filter_hsk_ingredient)
export interface SearchProps {
  option_name: string;
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const searchByNameFilterIngredient = async (params: SearchProps) => {
  return await httpClient
    .get<API.IResponseSearch>("/admin/manage-filters/search-filter-hsk-ingredient", {
      limit: params.limit,
      page: params.page,
      keyword: params.option_name,
    })
    .then((response) => response.data);
};
//get-active-(filter_hsk_ingredient)
export const fetchFilterActiveIngredient = async () => {
  return await httpClient
    .get<API.IResponseAPI>("/admin/manage-filters/get-active-filter-hsk-ingredients")
    .then((response) => response.data);
};
