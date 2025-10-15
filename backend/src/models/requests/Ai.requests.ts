
export type LanguageOption = 'vi' | 'en';

export interface SkincareAdvisorRequestBody {
  base64Image: string;
  userBudgetUSD?: number;
  userSchedulePreference?: string;
  preferredBrands?: string[];
  preferredIngredients?: string[];
  preferredOrigins?: string[];
  preferredProductTypes?: string[];
  preferredUses?: string[];
  preferredCharacteristics?: string[];
  preferredSizes?: string[];
  userPreferredSkinType?: string;
  language?: LanguageOption;
}

export type AIFeedbackFeature = 'skincare_analysis' | 'expert_chat';

export interface CreateAIFeedbackBody {
  feature: AIFeedbackFeature;
  rating: number;
  comment?: string;
  interactionId?: string;
}
