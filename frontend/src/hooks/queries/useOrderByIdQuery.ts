import { useQuery } from "@tanstack/react-query";

import { ordersService } from "@/services/orders.service";
import type { OrderByIdResponse } from "@/services/orders.service";
import type { ApiError } from "@/utils";

export const ORDER_BY_ID_QUERY_KEY = (orderId: string) => ["orders", orderId];

export const useOrderByIdQuery = (orderId: string | undefined) => {
  return useQuery<OrderByIdResponse, ApiError>({
    queryKey: ORDER_BY_ID_QUERY_KEY(orderId!),
    queryFn: async () => {
      const result = await ordersService.getOrderById(orderId!);
      if (result.isErr()) {
        throw result.error;
      }
      return result.value.data;
    },
    enabled: !!orderId,
  });
};
