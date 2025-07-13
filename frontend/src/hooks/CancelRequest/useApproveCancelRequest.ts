import { useCallback, useState } from "react";

import { approveCancelRequest } from "@/api/cancelRequest";

export const useApproveCancelRequest = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const appproveCancelRequest = useCallback(async () => {
    setLoading(true);
    try {
      await approveCancelRequest({ id: id });
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    appproveCancelRequest,
  };
};
