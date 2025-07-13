import { useCallback, useState } from "react";

import { searchByNameFilterBrand } from "@/api/brand";
import type { Brand } from "@/types/Filter/brand";

export interface SearchProps {
  option_name: string;
}
export const useSearchBrand = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Brand[]>([]);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [searchName, setSearchName] = useState<string>("");
  // const changePage = useCallback((page: number) => {
  //   setParams((prev) => ({ ...prev, page }));
  // }, []);
  // const changeLimit = useCallback((limit: number) => {
  //   setParams((prev) => ({ ...prev, limit }));
  // }, []);
  const searchBrandName = useCallback(async () => {
    setLoading(true);
    try {
      const response = await searchByNameFilterBrand({
        option_name: searchName,
        limit: params.limit,
        page: params.page,
      });
      setData(response.data);
      setParams((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit]);
  return {
    loading,
    data,
    params,
    setParams,
    searchBrandName,
    setSearchName,
    searchName,
    setLoading,
  };
};
