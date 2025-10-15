import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { aiService } from "@/services/aiServicce";

import type { AllFilterOptions, Message, Preference } from "../../types";
import type { SkincareAdvisorRequestBody } from "../../types";

export const useSkincareAI = () => {
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [preference, setPreference] = useState<Preference>("AM/PM");
  const [budget, setBudget] = useState(50);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasProvidedFeedback, setHasProvidedFeedback] = useState(false);

  const [selectedUserSkinType, setSelectedUserSkinType] = useState<string | undefined>(undefined);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [selectedUses, setSelectedUses] = useState<string[]>([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const {
    data: allFilterOptions,
    isLoading: isFilterOptionsLoading,
    error: filterOptionsError,
  } = useQuery<AllFilterOptions, Error>({
    queryKey: ["filterOptions"],
    queryFn: aiService.getFilterOptions,
    staleTime: Infinity,
  });

  const { mutate: getAdvice, isPending: isAnalyzing } = useMutation({
    mutationFn: (payload: SkincareAdvisorRequestBody) => aiService.getSkincareAdvice(payload),
    onSuccess: (recommendationData) => {
      
      if (
        recommendationData &&
        (recommendationData.routineRecommendation || recommendationData.error || recommendationData.info)
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            recommendation: recommendationData,
            isUser: false,
            hasSubmittedFeedback: hasProvidedFeedback,
          },
        ]);
      } else {
        const unexpectedMsg = "Nhận được định dạng phản hồi không mong đợi từ máy chủ.";
        toast.error(unexpectedMsg);
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: unexpectedMsg, isUser: false }]);
      }
    },
    onError: (error) => {
      const errorMessage = error.message || "Đã xảy ra lỗi không mong muốn.";
      toast.error(`Kết nối thất bại: ${errorMessage}`);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: `Lỗi: ${errorMessage}`, isUser: false }]);
    },
  });

  const handleImageUpload = useCallback((base64DataUrl: string) => setUploadedImageBase64(base64DataUrl), []);
  const handleImageRemove = useCallback(() => setUploadedImageBase64(null), []);

  const handleSubmit = useCallback(() => {
    if (!uploadedImageBase64) {
      toast.error("Vui lòng tải lên ảnh khuôn mặt của bạn trước");
      return;
    }

    const userMessageSummary = `Tìm quy trình ${preference === "AM" ? "buổi sáng" : preference === "PM" ? "buổi tối" : "cả ngày"}, ngân sách khoảng $${budget}.`;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: userMessageSummary, isUser: true, imageUrl: uploadedImageBase64 },
    ]);

    const payload: SkincareAdvisorRequestBody = {
      base64Image: uploadedImageBase64,
      userBudgetUSD: budget,
      userSchedulePreference: preference,
      userPreferredSkinType: selectedUserSkinType,
      preferredBrands: selectedBrands,
      preferredIngredients: selectedIngredients,
      preferredProductTypes: selectedProductTypes,
      preferredUses: selectedUses,
      preferredCharacteristics: selectedCharacteristics,
      preferredSizes: selectedSizes,
    };

    getAdvice(payload);
  }, [
    uploadedImageBase64,
    preference,
    budget,
    selectedUserSkinType,
    selectedBrands,
    selectedIngredients,
    selectedProductTypes,
    selectedUses,
    selectedCharacteristics,
    selectedSizes,
    getAdvice,
  ]);

  const handleClearAllFilters = () => {
    setSelectedUserSkinType(undefined);
    setSelectedBrands([]);
    setSelectedIngredients([]);
    setSelectedProductTypes([]);
    setSelectedUses([]);
    setSelectedCharacteristics([]);
    setSelectedSizes([]);
    toast.info("Đã xóa tất cả bộ lọc!");
  };

  const handleFeedbackSubmit = useCallback(
    async (messageId: string, rating: number, comment?: string) => {
      if (hasProvidedFeedback) {
        toast.success("Cảm ơn bạn! Bạn đã hoàn tất đánh giá cho phiên này.");
        return;
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, isFeedbackSubmitting: true } : msg))
      );

      try {
        await aiService.submitFeedback({
          feature: "skincare_analysis",
          rating,
          comment,
          interactionId: messageId,
        });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, isFeedbackSubmitting: false, hasSubmittedFeedback: true, rating, feedbackComment: comment }
              : msg
          )
        );
        setHasProvidedFeedback(true);

        toast.success("Cảm ơn bạn đã đánh giá gợi ý của chúng tôi!");
      } catch (error) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, isFeedbackSubmitting: false } : msg))
        );
        const errorMessage =
          error instanceof Error ? error.message : "Không thể gửi đánh giá ngay lúc này. Vui lòng thử lại.";
        toast.error(errorMessage);
      }
    },
    [hasProvidedFeedback]
  );

  return {
    uploadedImageBase64,
    preference,
    budget,
    messages,
    isAnalyzing,
    allFilterOptions,
    isFilterOptionsLoading,
    filterOptionsError,
    selectedUserSkinType,
    selectedBrands,
    selectedIngredients,
    selectedProductTypes,
    selectedUses,
    selectedCharacteristics,
    selectedSizes,
    setPreference,
    setBudget,
    setSelectedUserSkinType,
    setSelectedBrands,
    setSelectedIngredients,
    setSelectedProductTypes,
    setSelectedUses,
    setSelectedCharacteristics,
    setSelectedSizes,
    handleImageUpload,
    handleImageRemove,
    handleSubmit,
    handleClearAllFilters,
    handleFeedbackSubmit,
  };
};
