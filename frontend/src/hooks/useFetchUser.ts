import { useEffect, useState } from "react";

import { fetchListUser } from "@/api/user";
import type { User } from "@/types/user";

export const useFetchUser = () => {
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<User[]>([]);
  const fetchUser = async () => {
    const response = await fetchListUser(params.limit);
    console.log(response.data);
    setData(response.data);

    setParams({
      limit: response.pagination.limit,
      page: response.pagination.currentPage,
      totalPages: response.pagination.totalPages,
      totalRecords: response.pagination.totalRecords,
    });
  };
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    console.log(data);
  }, [data]);
  return { fetchUser, data, params, setParams };
};
