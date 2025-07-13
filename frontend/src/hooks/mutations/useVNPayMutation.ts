import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentService } from "@/services/paymentService";
import type { VNPayPayload } from "@/services/paymentService";
import type { ApiError } from "@/utils";

export const useVNPayMutation = () => {
  return useMutation({
    mutationFn: (payload: VNPayPayload) => paymentService.createVNPayUrl(payload),
    onSuccess: (result) => {
      if (result.isOk()) {
        window.location.href = result.value.data.data.paymentUrl;
      } else {
        toast.error("VNPay Payment Failed", {
          description: result.error.message || "Could not initiate VNPay payment.",
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("VNPay Payment Error", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
};