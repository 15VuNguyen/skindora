import { useCallback, useEffect, useState } from "react";

import { fetchFilterIngredient as fetchFilterIngredient_api, searchByNameFilterIngredient } from "@/api/ingredient";
import type { Ingredient } from "@/types/Filter/ingredient";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export const useFetchFilterIngredient = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const fetchFilterIngredient = useCallback(async () => {
    setLoading(true);
    try {
      let response;

      if (debouncedSearchTerm) {
        response = await searchByNameFilterIngredient({
          option_name: debouncedSearchTerm,
          limit: params.limit,
          page: params.page,
        });
      } else {
        response = await fetchFilterIngredient_api({
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
    fetchFilterIngredient,
    searchTerm,
    setSearchTerm,
  };
};
