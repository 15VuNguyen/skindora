import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth.context";
import { useClearCartMutation } from "@/hooks/mutations/useClearCartMutation";
import { usePrepareOrderMutation } from "@/hooks/mutations/usePrepareOrderMutation";
import {  useCartQuery } from "@/hooks/queries/useCartQuery";
import { useVouchersQuery } from "@/hooks/queries/useVouchersQuery";
import type { Voucher } from "@/types/voucher";
import { useUpdateCartMutation } from "@/hooks/mutations/useUpdateCartMutation";
import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation";
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
  const [mutatingItemId, setMutatingItemId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: cartResponse, isLoading: isCartLoading, isError, error } = useCartQuery(isAuthenticated);
  const { data: voucherResponse } = useVouchersQuery(isAuthenticated);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // --- MUTATIONS (Defined locally to access component state) ---
 const updateCartMutation = useUpdateCartMutation(setMutatingItemId);
  const removeFromCartMutation = useRemoveFromCartMutation(setMutatingItemId);



  const { mutate: clearCart, isPending: isClearing } = useClearCartMutation();
  const { mutate: prepareOrder, isPending: isPreparingOrder } = usePrepareOrderMutation();

  const cartItems = useMemo(
    () => (cartResponse?.result?.Products || []).map((item: ApiCartProduct) => ({ ...item, stock: item.stock || 99 })),
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
      toast.warning("Đã xóa mã giảm giá", {
        description: `Tổng đơn hàng của bạn hiện thấp hơn mức tối thiểu cho mã ${appliedVoucher.code}.`,
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
        toast.error("Không thể áp dụng mã giảm giá", {
          description: `Tổng đơn hàng của bạn chưa đạt tối thiểu ${Number(voucher.minOrderValue).toLocaleString(
            "vi-VN"
          )}₫.`,
        });
        return;
      }
      setAppliedVoucher(voucher);
      toast.success(`Đã áp dụng mã "${voucher.code}"!`);
    },
    [subtotal]
  );

  const handleApplyManualVoucher = useCallback(
    (code: string) => {
      const allVouchers = voucherResponse?.data ?? [];
      const voucherToApply = allVouchers.find((v) => v.code.toUpperCase() === code.toUpperCase());

      if (!voucherToApply) {
        toast.error("Mã giảm giá không hợp lệ", { description: "Mã bạn nhập không tồn tại." });
        return;
      }
      handleApplyVoucher(voucherToApply);
    },
    [voucherResponse, handleApplyVoucher]
  );

  const clearVoucher = () => {
    setAppliedVoucher(null);
    toast.info("Đã xóa mã giảm giá.");
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

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán.");
      return;
    }
    const selectedProductIDs = selectedItems.map((item) => item.ProductID);
    prepareOrder(selectedProductIDs, {
      onSuccess: () => {
        navigate("/checkout", { state: { appliedVoucher } });
      },
    });
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
    mutatingItemId,
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
    handleCheckout,
  };
};
