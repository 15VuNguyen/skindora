import { useMutation } from "@tanstack/react-query";

import { paymentService } from "@/services/paymentService";
import type { VNPayReturnData } from "@/services/paymentService";

export const useVerifyVNPayMutation = () => {
  return useMutation({
    mutationFn: (payload: VNPayReturnData) => paymentService.verifyVNPayReturn(payload),
  });
};
