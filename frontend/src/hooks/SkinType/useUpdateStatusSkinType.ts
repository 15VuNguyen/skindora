import { useCallback, useState } from "react";

import { updateStatusFilterSkin } from "@/api/skinType";

export interface PayloadProps {
  state: string;
}
export interface useUpdateStatusSkinTypeProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusSkinType = (params: useUpdateStatusSkinTypeProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const updateStateSkinType = useCallback(async (onSuccessCallback?: () => void) => {
    try {
      await updateStatusFilterSkin({ id: params.id }, params.payload);
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
    updateStateSkinType,
    setLoading,
  };
};
