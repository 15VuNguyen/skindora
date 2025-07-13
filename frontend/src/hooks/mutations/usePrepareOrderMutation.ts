import { useMutation } from "@tanstack/react-query";
import type { Result } from "neverthrow";
import { toast } from "sonner";

import { ordersService } from "@/services/orders.service";
import type { PreparedOrderResponse } from "@/services/orders.service";
import type { ApiError } from "@/utils";
import type { ApiResponse } from "@/utils/axios/types";

export const usePrepareOrderMutation = () => {
  return useMutation<Result<ApiResponse<PreparedOrderResponse>, ApiError>, Error, string[]>({
    mutationFn: (selectedProductIDs: string[]) => ordersService.prepareOrderFromCart(selectedProductIDs),
    onError: (error: Error) => {
      toast.error("Failed to Prepare Order", {
        description: error.message || "Please check your cart and try again.",
      });
    },
  });
};
