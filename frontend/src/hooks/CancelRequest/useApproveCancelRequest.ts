import { useCallback, useState } from "react";

import { approveCancelRequest } from "@/api/cancelRequest";

export const useApproveCancelRequest = ({ id, staffNote }: { id: string; staffNote: string }) => {
  const [loading, setLoading] = useState<boolean>();
  const appproveCancelRequest = useCallback(async () => {
    setLoading(true);
    try {
      console.log(staffNote);
      const reason = await approveCancelRequest({ id: id, payload: { staffNote: staffNote } });
      console.log(reason);
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
    } finally {
      setLoading(false);
    }
  }, [id, staffNote]);
  return {
    loading,
    appproveCancelRequest,
  };
};
