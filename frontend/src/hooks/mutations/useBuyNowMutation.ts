import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ordersService, type BuyNowPayload } from "@/services/orders.service";
import type { ApiError } from "@/utils";

export const useBuyNowMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: BuyNowPayload) => ordersService.buyNow(payload),
    onSuccess: (result) => {
      if (result.isOk()) {
        navigate("/checkout");
      } else {
        toast.error("Could not proceed with Buy Now", {
          description: result.error.message || "Please try again.",
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("An unexpected error occurred", {
        description: error.message || "Please check your connection and try again.",
      });
    },
  });
};