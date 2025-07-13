import { useCallback, useState } from "react";

import { fetchStaffProductByID } from "@/api/product";
import type { ProductFE } from "@/types/product";

export const useFetchStaffProductByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataID, setDataID] = useState<ProductFE>();
  const [data, setData] = useState<ProductFE>();
  const FetchStaffProductByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchStaffProductByID({
        id: id,
      });

      setData(response.result);
      setDataID(response.result);
    } catch (error) {
      console.error("Failed to fetch paginated users:", error);
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    dataID,
    data,
    FetchStaffProductByID,
  };
};
