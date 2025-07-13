import { useCallback, useState } from "react";

import { getVerifiedUserList } from "@/api/user";
import type { User } from "@/types/user";

export const useFetchUserIsVerified = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<User[]>([]);

  const fetchVerifiedUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getVerifiedUserList({ limit: 10, page: params.page });
      console.log(response);
      setData(response.data);
      setParams((prevParams) => ({
        ...prevParams,
        totalPages: response.pagination.totalPages,
        totalRecords: response.pagination.totalRecords,
      }));
    } catch (error) {
      console.error("Failed to fetch all users:", error);
    } finally {
      setTimeout(() => setLoading(false), 10000);
    }
  }, [params.limit, params.page]);
  return {
    loading,
    fetchVerifiedUser,
    data,
    params,
    setParams,
  };
};
