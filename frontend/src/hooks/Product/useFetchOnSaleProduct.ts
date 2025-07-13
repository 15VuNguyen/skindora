import { useCallback, useState } from "react";

import { fetchOnSaleProduct as api } from "@/api/product";
import type { ProductFE } from "@/types/product";

export const useFetchOnSale = () => {
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    totalPages: 1,
    totalRecords: 1,
  });

  const [data, setData] = useState<ProductFE[]>([]);
  const fetchOnSaleProduct = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api({ limit: 10, page: params.page });
      console.log(response);

      setParams({
        ...response.pagination,
        page: response.pagination.currentPage,
      });
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      setData([]);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  return {
    loading,
    data,
    params,
    setParams,
    setData,
    fetchOnSaleProduct,
  };
};
