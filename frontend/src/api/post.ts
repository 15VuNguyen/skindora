import httpClient from "@/lib/axios";
import type { Post } from "@/types/post";

export interface FetchAllPostProps {
  limit?: string | number;
  page?: string | number;
  totalPages?: string | number;
  totalRecords?: number;
  status?: string;
}
//get-all-post
export const fetchAllPost = async (params: FetchAllPostProps) => {
  return await httpClient
    .get<API.IResponseSearch<Post>>("/posts", {
      limit: params.limit,
      page: params.page,
      status: params.status,
    })
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
