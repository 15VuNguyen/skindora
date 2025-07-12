import httpClient from "@/lib/axios";
import type { ProductFE } from "@/types/product";

export interface FetchProductProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
  filter_brand?: string;
  filter_dac_tinh?: string;
  filter_hsk_ingredients?: string;
  filter_hsk_product_type?: string;
  filter_hsk_size?: string;
  filter_hsk_skin_type?: string;
  filter_hsk_uses?: string;
  filter_origin?: string;
}
export interface FetchProductByIDProps {
  id: string;
}
//get-all-product
export const fetchProduct = async (params: FetchProductProps) => {
  return await httpClient
    .get<API.IResponseSearch<ProductFE>>("/admin/manage-products/get-all", {
      limit: params.limit,
      page: params.page,
      filter_brand: params.filter_brand,
      filter_dac_tinh: params.filter_dac_tinh,
      filter_hsk_ingredients: params.filter_hsk_ingredients,
      filter_hsk_product_type: params.filter_hsk_product_type,
      filter_hsk_size: params.filter_hsk_size,
      filter_hsk_skin_type: params.filter_hsk_skin_type,
      filter_hsk_uses: params.filter_hsk_uses,
      filter_origin: params.filter_origin,
    })
    .then((response) => response.data);
};
//get-product-by-id
export const fetchProductByID = async (params: FetchProductByIDProps) => {
  return await httpClient
    .get<API.IResponse<ProductFE>>(`/admin/manage-products/${params.id}`)
    .then((response) => response.data);
};
//get-product-by-staff
export const fetchProductByStaff = async (params: FetchProductProps) => {
  return await httpClient
    .get<API.IResponseSearch<ProductFE>>("/staffs/manage-products/get-all", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};

//get-all-out-of-stock-product
export interface FetchOutOfStockProductProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const fetchOutOfStockProduct = async (params: FetchOutOfStockProductProps) => {
  return await httpClient
    .get<API.IResponseSearch<ProductFE>>("/admin/manage-products/out-of-stock", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};

//get-low-stock-product
export interface FetchLowStockProductProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const fetchLowStockProduct = async (params: FetchLowStockProductProps) => {
  return await httpClient
    .get<API.IResponseSearch<ProductFE>>("/admin/manage-products/low-stock", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};

//get-low-stock-product
export interface FetchOnSaleProductProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
export const fetchOnSaleProduct = async (params: FetchOnSaleProductProps) => {
  return await httpClient
    .get<API.IResponseSearch<ProductFE>>("/admin/manage-products/on-sale", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//get-all-statics-product
export interface ProductStatics {
  message: string;
  result: ResultProductStatics;
}
export interface ResultProductStatics {
  totalProducts: number | string;
  onSale: number | string;
  lowStock: number | string;
  outOfStock: number | string;
}
export const fetchAllStaticsProduct = async () => {
  return await httpClient.get<ProductStatics>("/admin/manage-products/stats", {}).then((response) => response.data);
};
