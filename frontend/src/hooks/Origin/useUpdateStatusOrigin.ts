import { useCallback, useState } from "react";

import { updateStatusFilterOrigin } from "@/api/origin";

export interface PayloadProps {
  state: string;
}
export interface useUpdateStatusOriginProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusOrigin = (params: useUpdateStatusOriginProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const updateStateOrigin = useCallback(async (onSuccessCallback?: () => void) => {
    try {
      await updateStatusFilterOrigin({ id: params.id }, params.payload);
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
    updateStateOrigin,
    setLoading,
  };
};
