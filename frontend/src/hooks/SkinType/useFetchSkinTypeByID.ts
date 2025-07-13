import { useCallback, useState } from "react";

import { fetchFilterSkinByID } from "@/api/skinType";
import type { SkinType } from "@/types/Filter/skinType";

export const useFetchSkinTypeByID = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<SkinType>();
  const fetchSkinTypeByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFilterSkinByID({
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
    fetchSkinTypeByID,
    data,
  };
};
