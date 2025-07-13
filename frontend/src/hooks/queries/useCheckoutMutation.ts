import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ordersService } from "@/services/orders.service";
import type { CheckoutPayload } from "@/services/orders.service";
import type { ApiError } from "@/utils";
import { MY_ORDERS_QUERY_KEY } from "./useMyOrdersQuery";
export const CART_QUERY_KEY = ["cart", "currentUser"];

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => ordersService.createOrder(payload),
    onSuccess: () => {
      // toast.success("Order Placed Successfully!", {
      //   description: "Thank you for your purchase. We will process it shortly.",
      // });
      queryClient.invalidateQueries({ queryKey: MY_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error("Checkout Failed", {
        description: error.message || "There was an issue placing your order. Please try again.",
      });
    },
  });
};
