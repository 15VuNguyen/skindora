import httpClient from "@/lib/axios";
import type { Post, PostUser } from "@/types/post";

export interface FetchAllPostProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
  status?: string;
  keyword?: string;
  filters?: filterProps;
}
export interface FilterOption {
  _id: string;
  option_name: string;
}

export interface filterProps {
  filter_brand?: string[];
  filter_hsk_skin_type?: string[];
  filter_hsk_uses?: string[];
  filter_dac_tinh?: string[];
  filter_hsk_ingredients?: string[];
  filter_hsk_size?: string[];
  filter_hsk_product_type?: string[];
  filter_origin?: string[];
}
//get-all-post
export const fetchAllPostForStaffAdmin = async (params: FetchAllPostProps) => {
  const { limit, page, status, keyword, filters } = params;
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append("limit", limit.toString());
  if (page) queryParams.append("page", page.toString());
  if (status) queryParams.append("status", status);
  if (keyword) queryParams.append("keyword", keyword);
  const convertedFilters: filterProps = {};
  if (filters) {
    Object.keys(filters).forEach((key) => {
      const filterKey = key as keyof filterProps;
      const filterValue = filters[filterKey];
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        convertedFilters[filterKey] = filterValue.map((item: any) => (typeof item === "string" ? item : item._id));
      }
    });
  }
  const requestBody = {
    filters: convertedFilters,
  };
  return await httpClient
    .post<API.IResponseSearch<Post>>(`/posts/get-all?${queryParams.toString()}`, requestBody)
    .then((response) => response.data);
};
//get-all-post-by-id
export interface detailPostProps {
  id: string;
  slug: string;
}
export const fetchPostById = async ({ id, slug }: detailPostProps) => {
  return await httpClient
    .get<API.IResponse<Post>>(`/posts/${slug}-${id}`, { id, slug })
    .then((response) => response.data.result);
};
//create-post
export const createPost = async (data: Post) => {
  return await httpClient.post<API.IResponse<Post>>("/posts", data).then((response) => response.data);
};
//delete-post
export const deletePost = async (id: string) => {
  return await httpClient.delete<API.IResponse<null>>(`/posts/${id}`).then((response) => response.data);
};
export const fetchAllPostForUser = async (params: FetchAllPostProps) => {
  const { limit, page, status, keyword, filters } = params;
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append("limit", limit.toString());
  if (page) queryParams.append("page", page.toString());
  if (status) queryParams.append("status", status);
  if (keyword) queryParams.append("keyword", keyword);
  const convertedFilters: filterProps = {};
  if (filters) {
    Object.keys(filters).forEach((key) => {
      const filterKey = key as keyof filterProps;
      const filterValue = filters[filterKey];
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        convertedFilters[filterKey] = filterValue.map((item: any) => (typeof item === "string" ? item : item._id));
      }
    });
  }
  const requestBody = {
    filters: convertedFilters,
  };
  return await httpClient
    .post<API.IResponseSearch<PostUser>>(`/users/posts?${queryParams.toString()}`, requestBody)
    .then((response) => response.data);
};
