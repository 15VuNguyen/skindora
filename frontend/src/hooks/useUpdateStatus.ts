import { useCallback, useState } from "react";

import { updateStatusOrder } from "@/api/order";

export const useUpdateStatus = () => {
  const [loading, setLoading] = useState<boolean>();

  const updateStatus = useCallback(async (params: { orderID: string }) => {
    setLoading(true);
    try {
      console.log(params.orderID);
      const response = await updateStatusOrder({ orderID: params.orderID });
      window.alert(response.message);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    updateStatus,
  };
};
