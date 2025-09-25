export interface AIUsageRecord {
  totalUsage: number;
  dailyUsage: DailyAIUsage[];
}
export interface DailyAIUsage {
  _id: string;
  date: string;
  count: number;
  created_at: string;
  updated_at: string;
}
