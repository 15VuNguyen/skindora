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
