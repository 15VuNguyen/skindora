
import { useQuery } from "@tanstack/react-query";
import { filterService } from "@/services/filterService";
import type { ApiError } from "@/utils";
import type { AllFilterOptions } from "@/services/filterService";

export const FILTER_OPTIONS_QUERY_KEY = ["filters", "all-options"];

export const useFilterOptionsQuery = () => {
  return useQuery<AllFilterOptions, ApiError>({
    queryKey: FILTER_OPTIONS_QUERY_KEY,
    queryFn: () => filterService.getOptions(),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false, 
  });
};