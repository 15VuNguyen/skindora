import { useCallback, useState } from "react";

import { fetchFilterSizeByID } from "@/api/size";
import type { Size } from "@/types/Filter/size";

export const useFetchSizeByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<Size>();
  const fetchSizeByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFilterSizeByID({
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
    fetchSizeByID,
    data,
  };
};
