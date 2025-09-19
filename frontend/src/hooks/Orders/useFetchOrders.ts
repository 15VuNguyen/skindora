import { useCallback, useState } from "react";

import { type FetchListOrderProps, fetchListOrder } from "@/api/order";
import type { Order } from "@/types/order";

export const useFetchOrder = () => {
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState<FetchListOrderProps>({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
    status: "ALL",
  });
  const [data, setData] = useState<Order[]>([]);

  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const changeStatus = useCallback((status: FetchListOrderProps["status"]) => {
    setParams((prev) => ({ ...prev, page: 1, status }));
  }, []);

  const changeLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, page: 1, limit }));
  }, []);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchListOrder({
        limit: params.limit,
        page: params.page,
        ...(params.status !== "ALL" && { status: params.status }),
      });
      console.log(response);
      setData(response.data);
      console.log(params);
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
  }, [params.page, params.limit, params.status]);

  return {
    loading,
    fetchOrder,
    data,
    params,
    setParams,
    changeLimit,
    changeStatus,
    changePage,
  };
};
