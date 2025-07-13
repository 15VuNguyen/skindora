import { useCallback, useState } from "react";

import { fetchOrderById } from "@/api/order";
import type { OrderAPIResult } from "@/types/order";

export const useFetchOrderByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<OrderAPIResult>();
  const FetchProductByID = useCallback(async () => {
    try {
      console.log("ID ne", id);
      const response = await fetchOrderById({
        orderId: id,
      });
      console.log(response);
      console.log(response.result);
      setData(response.result);
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    data,
    loading,
    FetchProductByID,
  };
};
