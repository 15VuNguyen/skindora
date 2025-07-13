import { useCallback, useState } from "react";

import { StaticsOrder } from "@/api/order";

export interface OrderStatics {
  total: number;
  statusCounts: {
    RETURNED: number | string;
    PENDING: number | string;
    DELIVERED: number | string;
    CANCELLED: number | string;
    SHIPPING: number | string;
    CONFIRMED: number | string;
  };
}
export const useFetchOrderStatics = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<OrderStatics>();

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const response = await StaticsOrder();
      console.log(response.result);
      setData(response.result);
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    fetchOrder,
    data,
  };
};
