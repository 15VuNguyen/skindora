
export interface ProductInRoutine {
  productName: string;
  brand: string;
  priceVND: string;
  roleInRoutine: string;
  reasoningForInclusion: string;
  keyIngredients: {
    ingredient: string;
    benefit: string;
  }[];
  usageInstructions: {
    applicationNotes: string;
    frequency: string;
  };
  productUrl: string;
}
export type LanguageOption = "vi" | "en";

export interface SkincareAdvisorRequestBody {
  base64Image: string;
  userBudgetUSD?: number;
  userSchedulePreference?: string;
  preferredBrands?: string[];
  preferredIngredients?: string[]
  preferredOrigins?: string[];
  preferredProductTypes?: string[];
  preferredUses?: string[];
  preferredCharacteristics?: string[];
  preferredSizes?: string[];
  userPreferredSkinType?: string;
  language?: LanguageOption;
}
export interface RoutineRecommendationData {
  diagnosedConcernCategories: string[];
  generalSkinObservations: string[];
  schedulePreference: string;
  totalRoutineCostVND: number;
  originalBudgetVND: number;
  fitsOverallBudget: boolean;
  overallRoutineRationale: string;
  productsInRoutine: ProductInRoutine[];
  suggestedOrderAM: string[];
  suggestedOrderPM: string[];
  additionalTips: string;
}

export interface SkinRecommendation {
  routineRecommendation?: RoutineRecommendationData;
  error?: string;
  info?: string;
}

export type Message = {
  id?: string;
  text?: string;
  recommendation?: SkinRecommendation;
  isUser: boolean;
  imageUrl?: string;
};

export type Preference = "AM" | "PM" | "AM/PM";

export interface FilterOption {
  filter_ID: string;
  name: string;
}
export interface AllFilterOptions {
  filter_brand?: FilterOption[];
  filter_hsk_skin_type?: FilterOption[];
  filter_hsk_uses?: FilterOption[];
  filter_hsk_product_type?: FilterOption[];
  filter_dac_tinh?: FilterOption[];
  filter_hsk_ingredient?: FilterOption[];
  filter_hsk_size?: FilterOption[];
}