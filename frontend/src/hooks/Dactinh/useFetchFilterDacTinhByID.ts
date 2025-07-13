import { useCallback, useState } from "react";

import { fetchFilterDacTinhByID as fetchFilterDacTinhByID_api } from "@/api/dactinh";
import type { DacTinh } from "@/types/Filter/dactinh";

export const useFetchFilterDacTinhByID = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DacTinh>();
  const fetchFilterDacTinhByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFilterDacTinhByID_api({ id: id });
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    data,
    fetchFilterDacTinhByID,
  };
};
