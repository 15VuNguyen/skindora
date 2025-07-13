import React, { useCallback, useEffect, useState } from "react";

import { fetchFilterOrigin, searchByNameFilterOrigin } from "@/api/origin";
import type { Origin } from "@/types/Filter/origin";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
export const useFetchOrigin = () => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<Origin[]>([]);
  const [params, setParams] = React.useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const changePage = React.useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);
  const changeLimit = React.useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, limit }));
  }, []);
  const fetchListOrigin = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (debouncedSearchTerm) {
        response = await searchByNameFilterOrigin({
          option_name: debouncedSearchTerm,
          limit: params.limit,
          page: params.page,
        });
      } else {
        response = await fetchFilterOrigin({
          limit: params.limit,
          page: params.page,
        });
      }
      setData(response.data);
      setParams((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params.limit, params.page, debouncedSearchTerm]);
  return {
    loading,
    changePage,
    params,
    changeLimit,
    data,
    setParams,
    searchTerm,
    setSearchTerm,
    fetchListOrigin,
  };
};
