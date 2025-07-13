import { useCallback, useEffect, useState } from "react";

import { fetchFilterProductType, searchByNameFilterProductType } from "@/api/productType";
import type { ProductType } from "@/types/Filter/productType";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
export const useFetchFilterProductType = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const fetchListFilterProductType = useCallback(async () => {
    setLoading(true);
    try {
      let response;

      if (debouncedSearchTerm) {
        response = await searchByNameFilterProductType({
          option_name: debouncedSearchTerm,
          limit: params.limit,
          page: params.page,
        });
      } else {
        response = await fetchFilterProductType({
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
    fetchListFilterProductType,
    searchTerm,
    setSearchTerm,
  };
};
