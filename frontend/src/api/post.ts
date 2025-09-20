import httpClient from "@/lib/axios";
import type { Post } from "@/types/post";

export interface FetchAllPostProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
}
//get-all-post
export const fetchAllPost = async (params: FetchAllPostProps) => {
  return await httpClient
    .get<API.IResponseSearch<Post>>("/posts", {
      limit: params.limit,
      page: params.page,
    })
    .then((response) => response.data);
};
//get-all-post-by-id
//create-post
export interface detailPostProps {
  id: string;
  slug: string;
}
export const fetchPostById = async ({ id, slug }: detailPostProps) => {
  return await httpClient
    .get<API.IResponse<Post>>(`/posts/${slug}-${id}`, { id, slug })
    .then((response) => response.data.result);
};
