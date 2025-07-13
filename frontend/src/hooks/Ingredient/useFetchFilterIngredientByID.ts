import { useCallback, useState } from "react";

import { fetchFilterIngredientByID } from "@/api/ingredient";
import type { Ingredient } from "@/types/Filter/ingredient";

export const useFetchIngredientByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<Ingredient>();
  const fetchIngredientByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFilterIngredientByID({
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
    fetchIngredientByID,
    data,
  };
};
