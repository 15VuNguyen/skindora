import { useCallback, useEffect, useState } from "react";

import { fetchAIUsage } from "@/api/aiusage";
import type { AIUsageRecord } from "@/types/aiusage";

export const useFetchAIUsage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AIUsageRecord | null>(null);

  const fetchAIUsageData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAIUsage();
      console.log(response.result);
      setData(response.result);

      console.log(data);
    } catch (error) {
      console.error("Failed to fetch AI usage data:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAIUsageData();
  }, [fetchAIUsageData]);

  return {
    loading,
    data,
    fetchAIUsageData,
  };
};
