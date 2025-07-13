import { useCallback, useState } from "react";

import { updateStatusFilterSize } from "@/api/size";

export interface PayloadProps {
  state: string;
}
export interface useUpdateStatusSizeProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusSize = (params: useUpdateStatusSizeProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const updateStateSize = useCallback(async (onSuccessCallback?: () => void) => {
    try {
      await updateStatusFilterSize({ id: params.id }, params.payload);
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
    updateStateSize,
    setLoading,
  };
};
