import type { AllFilterOptions, SkinRecommendation, SkincareAdvisorRequestBody } from "@/features/SkincareAI/types";
import { apiClient } from "@/lib/apiClient";

export const aiService = {
 
  getFilterOptions: async () => {
    const result = await apiClient.get<AllFilterOptions>("/filters/options");
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data;
  },


  getSkincareAdvice: async (payload: SkincareAdvisorRequestBody) => {
    const result = await apiClient.post<SkinRecommendation, SkincareAdvisorRequestBody>("/ai/skincare-advice", payload,{timeout: 190000});

    if (result.isErr()) {
      throw result.error; 
    }
    return result.value.data;
  },
};
