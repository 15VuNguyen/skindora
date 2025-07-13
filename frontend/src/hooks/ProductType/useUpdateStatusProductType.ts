import { useCallback, useState } from "react";

import { updateStatusFilterProductType } from "@/api/productType";

export interface PayloadProps {
  state: string;
}
export interface useUpdateProductTypeFilterProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusProductType = (params: useUpdateProductTypeFilterProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const updateStateProductType = useCallback(async (onSuccessCallback?: () => void) => {
    try {
      await updateStatusFilterProductType({ id: params.id }, params.payload);
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
    updateStateProductType,
    setLoading,
  };
};
