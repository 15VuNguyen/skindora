import { useCallback, useState } from "react";

import { fetchFilterProductTypeByID } from "@/api/productType";
import type { ProductType } from "@/types/Filter/productType";

export const useFetchFilterProductTypeByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<ProductType>();
  const fetchProductTypeByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFilterProductTypeByID({
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
    fetchProductTypeByID,
    data,
  };
};
