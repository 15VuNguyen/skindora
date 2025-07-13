import { useCallback, useEffect, useState } from "react";

import { fetchAllBrand, searchByNameFilterBrand } from "@/api/brand";
import type { Brand } from "@/types/Filter/brand";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export const useFetchBrand = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Brand[]>([]);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const changeLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, page: 1, limit }));
  }, []);

  const fetchListBrand = useCallback(async () => {
    setLoading(true);
    try {
      let response;

      if (debouncedSearchTerm) {
        response = await searchByNameFilterBrand({
          option_name: debouncedSearchTerm,
          limit: params.limit,
          page: params.page,
        });
      } else {
        response = await fetchAllBrand({
          limit: params.limit,
          page: params.page,
        });
      }
      console.log("Search name ", debouncedSearchTerm);
      setData(response.data);
      setParams((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to fetch brand data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit, debouncedSearchTerm]);

  useEffect(() => {
    fetchListBrand();
  }, [fetchListBrand]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setParams((prev) => ({ ...prev, page: 1 }));
    }
  }, [debouncedSearchTerm]);

  return {
    loading,
    data,
    params,
    setParams,
    changePage,
    changeLimit,
    searchTerm,
    setSearchTerm,
    fetchListBrand,
  };
};
