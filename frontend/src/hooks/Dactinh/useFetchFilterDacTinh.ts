import { useCallback, useEffect, useState } from "react";

import { fetchFilterDacTinh as fetchFilterDacTinh_api, searchByNameFilterDactinh } from "@/api/dactinh";
import type { DacTinh } from "@/types/Filter/dactinh";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export const useFetchFilterDacTinh = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<DacTinh[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const fetchFilterDacTinh = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (debouncedSearchTerm) {
        response = await searchByNameFilterDactinh({
          option_name: debouncedSearchTerm,
          limit: params.limit,
          page: params.page,
        });
      } else {
        response = await fetchFilterDacTinh_api({
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
      console.error("Failed to fetch all users:", error);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, debouncedSearchTerm]);

  return {
    loading,
    data,
    params,
    setParams,
    searchTerm,
    setSearchTerm,
    fetchFilterDacTinh,
  };
};
