import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// import { PREPARED_ORDER_QUERY_KEY } from "@/hooks/queries/usePreparedOrderQuery";
import { cartService } from "@/services/cartService";
import type { ApiError } from "@/utils";

import { CART_QUERY_KEY } from "../queries/useCartQuery";

export const useRemoveFromCartMutation = (setMutatingItemId: (id: string | null) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartService.removeItem(productId),
    onMutate: async (productId) => {
      setMutatingItemId(productId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      setMutatingItemId(null);
    },
    onError: (error: ApiError) => toast.error("Failed to remove item", { description: error.message }),
  });
};