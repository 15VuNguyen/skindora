import { useCallback, useState } from "react";

import { updateStatusBrand } from "@/api/brand";

export interface PayloadProps {
  state: string;
}
export interface useUpdateStatusBrandProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusBrand = (params: useUpdateStatusBrandProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateStateBrand = useCallback(async (onSuccessCallback?: () => void) => {
    try {
      await updateStatusBrand({ id: params.id }, params.payload);
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
    updateStateBrand,
    setLoading,
  };
};
