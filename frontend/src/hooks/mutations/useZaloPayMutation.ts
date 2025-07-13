import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentService } from "@/services/paymentService";
import type { ZaloPayPayload } from "@/services/paymentService";
import type { ApiError } from "@/utils";

export const useZaloPayMutation = () => {
  return useMutation({
    mutationFn: (payload: ZaloPayPayload) => paymentService.createZaloPayOrder(payload),
    onSuccess: (result) => {
      if (result.isOk() && result.value.data.returncode === 1) {
        window.location.href = result.value.data.orderurl;
      } else {
        const errorMessage = result.isErr() ? result.error.message : result.value.data.returnmessage;
        toast.error("ZaloPay Payment Failed", {
          description: errorMessage || "Could not initiate ZaloPay payment.",
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("ZaloPay Payment Error", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
};