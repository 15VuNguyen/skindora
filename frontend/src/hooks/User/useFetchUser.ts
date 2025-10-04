import { useCallback, useEffect, useState } from "react";

import { fetchListUser } from "@/api/user";
import type { User } from "@/types/user";

export const useFetchUser = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<User[]>([]);
  const [allUser, setAllUser] = useState<User[]>([]);
  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);
  const fetchAllUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchListUser(params);
      setAllUser(response.data);
      setParams((prevParams) => ({
        ...prevParams,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      setAllUser([]);
    } finally {
      setTimeout(() => setLoading(false), 10000);
    }
  }, []);
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchListUser(params);
      setData(response.data);
      setParams((prevParams) => ({
        ...prevParams,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.limit]);
  useEffect(() => {
    fetchAllUser();
  }, [params.page, params.limit]);
  return {
    loading,
    fetchUser,
    data,
    params,
    setParams,
    allUser,
    fetchAllUser,
    changePage,
  };
};
