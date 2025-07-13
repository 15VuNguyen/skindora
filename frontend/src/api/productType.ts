import httpClient from "@/lib/axios";
import type { ProductType } from "@/types/Filter/productType";

export interface FetchFilterProductTypeProps {
  limit?: number | string;
  page?: number | string;
}
//get-all-(filter_hsk_product_type)
export const fetchFilterProductType = async (params: FetchFilterProductTypeProps) => {
  return await httpClient
    .get<API.IResponseSearch<ProductType>>("/admin/manage-filters/get-all-filter-hsk-product-types", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//create-(filter_hsk_product_type)
export const createFilterProductType = async (payload: ProductType) => {
  return await httpClient
    .post("/admin/manage-filters/create-new-filter-hsk-product-type", payload)
    .then((response) => response.data);
};
//get-all-(filter_hsk_product_type)
export interface IDFilterProductTypeProps {
  id: string;
}
export const fetchFilterProductTypeByID = async (params: IDFilterProductTypeProps) => {
  return await httpClient
    .get<API.IResponseAPI>(`/admin/manage-filters/get-filter-hsk-product-type-detail/${params.id}`)
    .then((response) => response.data);
};
//update-(filter_hsk_product_type)
export const updateFilterProductType = async (params: IDFilterProductTypeProps, payload: ProductType) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-product-type/${params.id}`, payload)
    .then((response) => response.data);
};
//update-status-(filter_hsk_product_type)
export const updateStatusFilterProductType = async (params: IDFilterProductTypeProps, payload: { state: string }) => {
  return await httpClient
    .put(`/admin/manage-filters/update-filter-hsk-product-type-state/${params.id}`, payload)
    .then((response) => response.data);
};

//search-by-name(filter_hsk_product_type)
export interface SearchProps {
  option_name: string;
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const searchByNameFilterProductType = async (params: SearchProps) => {
  return await httpClient
    .get<API.IResponseSearch>("/admin/manage-filters/search-filter-hsk-product-type", {
      limit: params.limit,
      page: params.page,
      keyword: params.option_name,
    })
    .then((response) => response.data);
};
//get-active-(filter_hsk_product_type)
export const fetchFilterActiveProductType = async () => {
  return await httpClient
    .get<API.IResponseAPI>("/admin/manage-filters/get-active-filter-hsk-product-types")
    .then((response) => response.data);
};
