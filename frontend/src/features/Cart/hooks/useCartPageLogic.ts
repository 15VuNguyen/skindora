import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth.context";
import { useClearCartMutation } from "@/hooks/mutations/useClearCartMutation";
import { usePrepareOrderMutation } from "@/hooks/mutations/usePrepareOrderMutation";
import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation";
import { useUpdateCartMutation } from "@/hooks/mutations/useUpdateCartMutation";
import { useCartQuery } from "@/hooks/queries/useCartQuery";
import { useVouchersQuery } from "@/hooks/queries/useVouchersQuery";
import type { Voucher } from "@/types/voucher";

interface ApiCartProduct {
  ProductID: string;
  Quantity: number;
  name: string;
  image: string;
  unitPrice: number;
  totalPrice: number;
  stock?: number;
}

export const useCartPageLogic = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: cartResponse, isLoading: isCartLoading, isError, error } = useCartQuery(isAuthenticated);
  const { data: voucherResponse } = useVouchersQuery(isAuthenticated); 

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  const { mutate: clearCart, isPending: isClearing } = useClearCartMutation();
  const updateCartMutation = useUpdateCartMutation();
  const removeFromCartMutation = useRemoveFromCartMutation();
  const { isPending: isPreparingOrder } = usePrepareOrderMutation();

  const isMutating = updateCartMutation.isPending || removeFromCartMutation.isPending;

  const cartItems = useMemo(
    () =>
      (cartResponse?.result?.Products || []).map((item: ApiCartProduct) => ({
        ...item,
        stock: item.stock || 99,
      })),
    [cartResponse]
  );

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedItemIds.includes(item.ProductID)),
    [cartItems, selectedItemIds]
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((total, item) => total + item.unitPrice * item.Quantity, 0),
    [selectedItems]
  );

  
  useEffect(() => {
    if (appliedVoucher && subtotal < Number(appliedVoucher.minOrderValue)) {
      setAppliedVoucher(null);
      toast.warning("Voucher removed", {
        description: `Your order total is now below the minimum required for the ${appliedVoucher.code} voucher.`,
      });
    }
  }, [subtotal, appliedVoucher]);
  

  const discountAmount = useMemo(() => {
    if (!appliedVoucher || subtotal < Number(appliedVoucher.minOrderValue)) return 0;
    let discount = 0;
    if (appliedVoucher.discountType === "FIXED") {
      discount = Number(appliedVoucher.discountValue);
    } else if (appliedVoucher.discountType === "PERCENTAGE") {
      discount = (subtotal * Number(appliedVoucher.discountValue)) / 100;
      if (Number(appliedVoucher.maxDiscountAmount) > 0 && discount > Number(appliedVoucher.maxDiscountAmount)) {
        discount = Number(appliedVoucher.maxDiscountAmount);
      }
    }
    return discount;
  }, [appliedVoucher, subtotal]);

  const shipping = subtotal > 500000 || subtotal === 0 ? 0 : 30000;

  const total = useMemo(() => {
    const calculatedTotal = subtotal + shipping - discountAmount;
    return calculatedTotal > 0 ? calculatedTotal : 0;
  }, [subtotal, shipping, discountAmount]);

  const handleApplyVoucher = useCallback(
    (voucher: Voucher) => {
      if (subtotal < Number(voucher.minOrderValue)) {
        toast.error("Cannot apply voucher", {
          description: `Your order total does not meet the minimum requirement of ${Number(voucher.minOrderValue).toLocaleString("vi-VN")}₫.`,
        });
        return;
      }
      setAppliedVoucher(voucher);
      toast.success(`Voucher "${voucher.code}" applied!`);
    },
    [subtotal]
  );

  const handleApplyManualVoucher = useCallback(
    (code: string) => {
      const allVouchers = voucherResponse?.data ?? [];
      const voucherToApply = allVouchers.find((v) => v.code.toUpperCase() === code.toUpperCase());

      if (!voucherToApply) {
        toast.error("Invalid Voucher", { description: "The voucher code you entered does not exist." });
        return;
      }
      handleApplyVoucher(voucherToApply);
    },
    [voucherResponse, handleApplyVoucher]
  );

  const clearVoucher = () => {
    setAppliedVoucher(null);
    toast.info("Voucher removed.");
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItemIds(cartItems.map((item) => item.ProductID));
    } else {
      setSelectedItemIds([]);
    }
  }, [cartItems]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate(id);
    } else {
      updateCartMutation.mutate({ productId: id, quantity });
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCartMutation.mutate(id);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItemIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedItemIds(checked ? cartItems.map((item) => item.ProductID) : []);
  };

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  return {
    navigate,
    isCartLoading,
    isError,
    error,
    cartItems,
    isAllSelected,
    isClearing,
    isMutating,
    isPreparingOrder,
    isVoucherDialogOpen,
    subtotal,
    shipping,
    total,
    discountAmount,
    appliedVoucher,
    selectedItems,
    selectedItemIds,
    handleSelectAll,
    handleSelectItem,
    handleRemoveItem,
    handleUpdateQuantity,
    handleApplyVoucher,
    handleApplyManualVoucher,
    clearVoucher,
    clearCart,
    setIsVoucherDialogOpen,
  };
};
