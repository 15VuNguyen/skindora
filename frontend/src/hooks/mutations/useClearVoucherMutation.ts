import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PREPARED_ORDER_QUERY_KEY } from "@/hooks/queries/usePreparedOrderQuery";
import { cartService } from "@/services/cartService";
import type { ApiError } from "@/utils";

export const useClearVoucherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearVoucher(),
    onSuccess: () => {
      toast.info("Voucher removed.");
      queryClient.invalidateQueries({ queryKey: PREPARED_ORDER_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error("Could not remove voucher", { description: error.message });
    },
  });
};
