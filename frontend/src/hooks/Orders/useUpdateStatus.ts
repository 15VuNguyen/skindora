import { useCallback, useState } from "react";
import { toast } from "sonner";

import { updateStatusOrder } from "@/api/order";

export const useUpdateStatus = (id: string) => {
  const [loading, setLoading] = useState<boolean>(false);

  const updateStatus = useCallback(
    async (onSuccessCallback?: () => void) => {
      setLoading(true);
      try {
        const response = await updateStatusOrder({ orderID: id });

        // Check nếu lỗi 400
        if (response.status === 400) {
          toast.error(response.message);
          return; // Dừng ở đây luôn
        }

        // Nếu thành công
        toast.success(response.message); // optional
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      } catch (error: any) {
        const errorMsg = error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
        toast.error(errorMsg);
        console.error("Failed to update order status:", error);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  return {
    loading,
    updateStatus,
  };
};
