import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartService } from "@/services/cartService";
import { CART_QUERY_KEY } from "../queries/useCartQuery";
import type { ApiError } from "@/utils";

export const useUpdateCartMutation = (setMutatingItemId: (id: string | null) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateItemQuantity(productId, quantity),

   
    onMutate: async (variables) => {
      setMutatingItemId(variables.productId);
    },

    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      setMutatingItemId(null);
    },

    onError: (error: ApiError) => {
      toast.error("Update failed", { description: error.message });
    },
  });
};