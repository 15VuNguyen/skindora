import { useCallback, useState } from "react";

import { fetchVoucherByID } from "@/api/voucher";
import type { Voucher } from "@/types/voucher";
import { logger } from "@/utils";

export const useFetchVoucherByID = (voucherId: string) => {
  const [loading, setLoading] = useState(false);
  const [voucher, setAllVoucher] = useState<Voucher>();
  const fetchAllVoucherByID = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchVoucherByID({ voucherId: voucherId });
      logger.debug(response);
      setAllVoucher(response.data);
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      setAllVoucher(undefined);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  return {
    loading,
    voucher,
    fetchAllVoucherByID,
  };
};
