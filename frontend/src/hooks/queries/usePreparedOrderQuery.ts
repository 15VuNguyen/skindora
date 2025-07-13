import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import type { PreparedOrderResponse } from "@/services/orders.service";
import type { ApiError } from "@/utils";

export const PREPARED_ORDER_QUERY_KEY = ["order", "prepared"];

export const usePreparedOrderQuery = (enabled: boolean) => {
  return useQuery<PreparedOrderResponse, ApiError>({
    queryKey: PREPARED_ORDER_QUERY_KEY,
    queryFn: async () => {
      const result = await ordersService.getPreparedOrder();
      if (result.isErr()) {
        throw result.error;
      }
      return result.value.data;
    },
    enabled: enabled,
   
    staleTime: 5 * 60 * 1000, 
  });
};