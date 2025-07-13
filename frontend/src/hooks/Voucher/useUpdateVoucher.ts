import { useCallback, useEffect, useState } from "react";

import { updateVoucher } from "@/api/voucher";

export interface VoucherUpdate {
  code: string;
  description: string;
  discountValue: string | number;
  discountType: string;
  maxDiscountAmount: string | number;
  minOrderValue: string | number;
  startDate: string;
  endDate: string;
  usageLimit: number | string;
  userUsageLimit: number | string;
}
export const useUpdateVoucher = (id: string) => {
  const [loading, setLoading] = useState<boolean>();
  const [voucherUpdate, setVoucherUpdate] = useState<VoucherUpdate>();
  const [status, setStatus] = useState<number | undefined>();
  const updateVoucherByID = useCallback(async (payload: VoucherUpdate) => {
    try {
      const response = await updateVoucher({ voucherId: id }, payload);
      console.log(response.data);
      console.log(response.status);
      setStatus(response.status as number);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      setVoucherUpdate(undefined);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    console.log(status);
  }, [status]);
  return {
    loading,
    status,
    voucherUpdate,
    updateVoucherByID,
  };
};
