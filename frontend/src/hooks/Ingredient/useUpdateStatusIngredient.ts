import { useCallback, useState } from "react";

import { updateStatusFilterIngredient } from "@/api/ingredient";

export interface PayloadProps {
  state: string;
}
export interface useUpdateIngredientFilterProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusIngredient = (params: useUpdateIngredientFilterProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateStateIngredient = useCallback(async (onSuccessCallback?: () => void) => {
    try {
      await updateStatusFilterIngredient({ id: params.id }, params.payload);
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
    updateStateIngredient,
    setLoading,
  };
};
