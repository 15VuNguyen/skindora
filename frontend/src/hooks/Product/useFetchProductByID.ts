import { useCallback, useState } from "react";

import { fetchProductByID } from "@/api/product";
import type { ProductFE } from "@/types/product";

export const useFetchProductByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataID, setDataID] = useState<ProductFE>();
  const [data, setData] = useState<ProductFE>();
  const FetchProductByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchProductByID({
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
    FetchProductByID,
  };
};
