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
    const result = await apiClient.post<SkinRecommendation, SkincareAdvisorRequestBody>(
      "/ai/skincare-advice",
      payload,
      { timeout: 190000 }
    );

    if (result.isErr()) {
      throw result.error;
    }
    const responseData = result.value.data;
    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData &&
      responseData.message === "No products found matching the initial criteria and budget."
    ) {
      const transformedData: SkinRecommendation = {
        info: "Không tìm thấy sản phẩm nào phù hợp. Vui lòng thử thay đổi các tùy chọn trong bộ lọc của bạn.",
      };
      return transformedData;
    }
    return responseData;
  },
};
