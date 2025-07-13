import { useCallback, useState } from "react";

import { fetchFilterUsesByID } from "@/api/uses";
import type { Uses } from "@/types/Filter/uses";

export const useFetchUsesByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<Uses>();
  const fetchUsesByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFilterUsesByID({
        id: id,
      });
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    fetchUsesByID,
    data,
  };
};
