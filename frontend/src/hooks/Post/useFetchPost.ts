import { useCallback, useEffect, useState } from "react";

import { fetchAllPost } from "@/api/post";
import type { Post } from "@/types/post";

export const useFetchPost = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Post[]>([]);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);
  const changeLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, page: 1, limit }));
  }, []);
  const fetchListPost = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAllPost(params);
      setData(response.data);
      setParams((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [params.limit, params.page]);

  return {
    loading,
    data,
    params,
    changePage,
    changeLimit,
    fetchListPost,
    setParams,
  };
};
