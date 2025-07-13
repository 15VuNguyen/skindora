import { useCallback, useEffect, useState } from "react";

import { fetchListVoucher } from "@/api/voucher";
import type { Voucher } from "@/types/voucher";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
export const useFetchVoucher = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [data] = useState<Voucher[]>([]);
  const [voucher, setAllVoucher] = useState<Voucher[]>([]);
  const fetchAllVoucher = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (debouncedSearchTerm) {
        response = await fetchListVoucher({
          code: debouncedSearchTerm,
          limit: params.limit,
          page: params.page,
        });
      } else {
        response = await fetchListVoucher({
          // code: debouncedSearchTerm,
          limit: params.limit,
          page: params.page,
        });
      }
      console.log(response);
      setParams({
        ...response.pagination,
        page: response.pagination.currentPage,
      });
      setAllVoucher(response.data);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      setAllVoucher([]);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [debouncedSearchTerm, params.page, params.limit]);

  return {
    loading,
    data,
    params,
    setParams,
    voucher,
    searchTerm,
    setSearchTerm,
    fetchAllVoucher,
  };
};
