import { useCallback, useState } from "react";

import { fetchAllStaticsProduct as api } from "@/api/product";
import type { ResultProductStatics } from "@/api/product";

export const useFetchStaticsProduct = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<ResultProductStatics>();
  const fetchStaticsProduct = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api();
      console.log(response.result);
      setData(response.result);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  return {
    loading,
    data,
    setData,
    fetchStaticsProduct,
  };
};
