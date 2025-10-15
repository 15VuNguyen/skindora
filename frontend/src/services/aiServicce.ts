import type { AllFilterOptions, SkinRecommendation, SkincareAdvisorRequestBody } from "@/features/SkincareAI/types";
import { apiClient } from "@/lib/apiClient";
import { config } from "@/config/config";
import { getAccessToken } from "@/utils/tokenManager";
import type { AIFeedbackPayload, AIFeedbackSummary, AIExperienceFeature } from "@/types/ai";

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
      { timeout: 400000 }
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

  startChatStream: async (body: { message: string; history: Array<{ role: string; content: string }> }) => {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${config.apiBaseUrl}/ai/chat/stream`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    return response;
  },

  submitFeedback: async (payload: AIFeedbackPayload) => {
    const result = await apiClient.post<{ message: string }, AIFeedbackPayload>("/ai/feedback", payload);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data;
  },

  getFeedbackSummary: async (feature?: AIExperienceFeature) => {
    const query = feature ? `?feature=${feature}` : "";
    const result = await apiClient.get<AIFeedbackSummary | AIFeedbackSummary[]>(`/ai/feedback${query}`);
    if (result.isErr()) {
      throw result.error;
    }
    return result.value.data;
  },
};
