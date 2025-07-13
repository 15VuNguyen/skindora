
import { apiClient } from "@/lib/apiClient";

export interface FilterOption {
  filter_ID: string;
  name: string;
}

export interface AllFilterOptions {
  [key: string]: FilterOption[];
}

export const filterService = {
  getOptions: async (): Promise<AllFilterOptions> => {
    const result = await apiClient.get<AllFilterOptions>("/filters/options");

    if (result.isErr()) {
      throw result.error;
    }

    return result.value.data;
  },
};