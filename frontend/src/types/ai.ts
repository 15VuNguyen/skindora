export type AIExperienceFeature = "skincare_analysis" | "expert_chat";

export interface AIFeedbackPayload {
  feature: AIExperienceFeature;
  rating: number;
  comment?: string;
  interactionId?: string;
}

export interface AIFeedbackComment {
  rating: number;
  comment: string;
  created_at: string;
}

export interface AIFeedbackSummary {
  feature: AIExperienceFeature;
  averageRating: number;
  total: number;
  recentComments: AIFeedbackComment[];
}
