import { useCallback, useState } from "react";

import { getBrandByID } from "@/api/brand";
import type { Brand } from "@/types/Filter/brand";

export const useFetchBrandByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<Brand>();

  const fetchBrandByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getBrandByID({
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
    fetchBrandByID,
    data,
  };
};
