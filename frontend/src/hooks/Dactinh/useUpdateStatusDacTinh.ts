import { useCallback, useState } from "react";

import { updateStatusFilterDactinh } from "@/api/dactinh";

export interface PayloadProps {
  state: string;
}
export interface useUpdateStatusDacTinhProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusDacTinh = (params: useUpdateStatusDacTinhProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateStateDacTinh = useCallback(async (onSuccessCallback?: () => void) => {
    try {
      await updateStatusFilterDactinh({ id: params.id }, params.payload);
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    updateStateDacTinh,
    setLoading,
  };
};
