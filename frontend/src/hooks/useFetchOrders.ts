import { useCallback, useState } from "react";

import { fetchListOrder } from "@/api/order";
import type { Order } from "@/types/order";

export const useFetchOrder = () => {
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });
  const [data, setData] = useState<Order[]>([]);

  const changePage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const changeLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, page: 1, limit }));
  }, []);

  // 3. Cập nhật hàm fetchUser với quản lý loading
  const fetchOrder = useCallback(async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const response = await fetchListOrder({ limit: params.limit, page: params.page });
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

  return {
    loading, // Thêm vào
    fetchOrder,
    data,
    params,
    setParams,
    changePage,
  };
};
