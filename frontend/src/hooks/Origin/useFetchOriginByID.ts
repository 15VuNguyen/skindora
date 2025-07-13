import { useCallback, useState } from "react";

import { fetchFilterOriginByID } from "@/api/origin";
import type { Origin } from "@/types/Filter/origin";

export const useFetchOriginByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<Origin>();
  const fetchOriginByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFilterOriginByID({
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
    fetchOriginByID,
    data,
  };
};
