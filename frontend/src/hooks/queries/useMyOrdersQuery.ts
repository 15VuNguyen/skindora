import { useQuery } from "@tanstack/react-query";

import { ordersService } from "@/services/orders.service";
import type { MyOrder, OrderData } from "@/services/orders.service";
import type { ApiError } from "@/utils";

export const MY_ORDERS_QUERY_KEY = ["orders", "me"];

const fetchAndEnrichMyOrders = async (): Promise<MyOrder[]> => {
  
  const initialResult = await ordersService.getMyOrders();
  if (initialResult.isErr()) {
    throw initialResult.error;
  }

  const initialOrders = initialResult.value.data.result || [];
  if (initialOrders.length === 0) {
    return [];
  }

  
  const detailFetchPromises = initialOrders.map((order) => ordersService.getOrderById(order.orderId));

  const detailResults = await Promise.all(detailFetchPromises);

  const orderDetailsMap = new Map<string, OrderData>();
  detailResults.forEach((result) => {
    if (result.isOk()) {
      const { order } = result.value.data.result;

      orderDetailsMap.set(order._id, order);
    }
  });

  const enrichedOrders = initialOrders.map((order) => {
    const fullOrderDetails = orderDetailsMap.get(order.orderId);
    return {
      ...order,
      TotalPrice: fullOrderDetails?.TotalPrice ?? "0",
      OrderDate: fullOrderDetails?.created_at || new Date().toISOString(),
    };
  });

  return enrichedOrders;
};

export const useMyOrdersQuery = (enabled: boolean) => {
  return useQuery<MyOrder[], ApiError>({
    queryKey: MY_ORDERS_QUERY_KEY,
    queryFn: fetchAndEnrichMyOrders,
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
  });
};
