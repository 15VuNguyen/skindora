import { useCallback, useState } from "react";

import { fetchAllPost } from "@/api/post";
import type { Post } from "@/types/post";

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
export const useFetchPost = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Post[]>([]);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
    status: "",
    keyword: "",
    filters: {} as filterProps,
  });
  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);
  const changeLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, page: 1, limit }));
  }, []);
  const changeStatus = useCallback((status: string) => {
    setParams((prev) => ({ ...prev, page: 1, status }));
  }, []);
  const changeKeyword = useCallback((keyword: string) => {
    setParams((prev) => ({ ...prev, page: 1, keyword }));
  }, []);
  const addFilterValue = useCallback((filterKey: keyof filterProps, value: string) => {
    setParams((prev) => {
      const currentFilters = prev.filters || {};
      const existingValues = currentFilters[filterKey] || [];
      const updatedValues = existingValues.includes(value)
        ? existingValues.filter((v) => v !== value) // Remove if exists
        : [...existingValues, value]; // Add if not exists
      return {
        ...prev,
        page: 1,
        filters: {
          ...currentFilters,
          [filterKey]: updatedValues,
        },
      };
    });
  }, []);
  const changeFilter = useCallback((newFilters: filterProps) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      filters: newFilters,
    }));
  }, []);
  const removeFilterValue = useCallback((filterKey: keyof filterProps, value: string) => {
    setParams((prev) => {
      const currentFilters = prev.filters || {};
      const existingValues = currentFilters[filterKey] || [];
      const updatedValues = existingValues.filter((v) => v !== value); // Remove the value
      return {
        ...prev,
        page: 1,
        filters: {
          ...currentFilters,
          [filterKey]: updatedValues,
        },
      };
    });
  }, []);
  const fetchListPost = useCallback(async () => {
    setLoading(true);
    console.log("🚀 Fetching posts with params:", params);
    console.log("📁 Filters being sent:", params.filters);
    try {
      const response = await fetchAllPost(params);
      setData(response.data);
      setParams((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [params.limit, params.page, params.status, params.keyword, params.filters]);

  return {
    loading,
    data,
    params,
    changePage,
    changeLimit,
    fetchListPost,
    setParams,
    changeStatus,
    changeKeyword,
    addFilterValue,
    changeFilter,
    removeFilterValue,
  };
};
