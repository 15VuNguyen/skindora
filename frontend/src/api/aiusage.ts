import httpClient from "@/lib/axios";
import type { AIUsageRecord } from "@/types/aiusage";

//get-ai-usage
export const fetchAIUsage = async () => {
  return await httpClient
    .get<API.IResponseAPI<AIUsageRecord>>("/admin/ai-usage-stats")
    .then((response) => response.data);
};
