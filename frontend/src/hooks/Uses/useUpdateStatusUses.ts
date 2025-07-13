import { useCallback, useState } from "react";

import { updateStatusFilterUses } from "@/api/uses";

export interface PayloadProps {
  state: string;
}
export interface useUpdateStatusSkinTypeProps {
  id: string;
  payload: {
    state: string;
  };
}
export const useUpdateStatusFilterUses = (params: useUpdateStatusSkinTypeProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const updateStateFilterUses = useCallback(async (onSuccessCallback?: () => void) => {
    try {
      await updateStatusFilterUses({ id: params.id }, params.payload);
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
    updateStateFilterUses,
    setLoading,
  };
};
