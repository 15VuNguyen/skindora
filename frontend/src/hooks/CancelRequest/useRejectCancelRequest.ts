import { useCallback, useState } from "react";

import { rejectCancelRequest } from "@/api/cancelRequest";

export const useRejectCancelRequest = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const rejectedCancelRequest = useCallback(async () => {
    setLoading(true);
    try {
      await rejectCancelRequest({ id: id });
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    rejectedCancelRequest,
  };
};
