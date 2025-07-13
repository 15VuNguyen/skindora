import { useCallback, useState } from "react";

import { rejectCancelRequest } from "@/api/cancelRequest";

export const useRejectCancelRequest = ({ id, staffNote }: { id: string; staffNote: string }) => {
  const [loading, setLoading] = useState<boolean>();
  const rejectedCancelRequest = useCallback(async () => {
    setLoading(true);
    try {
      const response = await rejectCancelRequest({ id: id, payload: { staffNote: staffNote } });
      console.log(response);
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
    } finally {
      setLoading(false);
    }
  }, [id, staffNote]);
  return {
    loading,
    rejectedCancelRequest,
  };
};
