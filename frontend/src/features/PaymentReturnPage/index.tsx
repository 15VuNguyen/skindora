import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { config } from "@/config/config";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paramsString = searchParams.toString();

    const zaloPayStatus = searchParams.get("status");
    if (zaloPayStatus) {
      if (zaloPayStatus === "1") {
        const backendVerificationUrl = `${config.apiBaseUrl}/payment/zalopay_callbacks?${paramsString}`;
        window.location.href = backendVerificationUrl;
      } else {
        toast.error("Thanh toán thất bại", {
          description: "Giao dịch qua ZaloPay không thành công. Vui lòng thử lại.",
        });
        navigate("/checkout");
      }
      return;
    }

    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    if (vnp_ResponseCode) {
      if (vnp_ResponseCode === "00") {
        const backendVerificationUrl = `${config.apiBaseUrl}/payment/vnpay_return?${paramsString}`;
        window.location.href = backendVerificationUrl;
      } else {
        toast.error("Thanh toán thất bại", {
          description: "Giao dịch qua VNPay không thành công. Vui lòng thử lại.",
        });
        navigate("/checkout");
      }
      return;
    }

    toast.error("URL thanh toán không hợp lệ", {
      description: "Không thể xác định được nhà cung cấp thanh toán.",
    });
    navigate("/error");
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <LoaderCircle className="text-primary h-16 w-16 animate-spin" />
      <h1 className="mt-6 text-2xl font-bold">Đang hoàn tất thanh toán...</h1>
      <p className="text-muted-foreground mt-2">Vui lòng không đóng cửa sổ này. Quá trình này hoàn toàn tự động.</p>
    </div>
  );
};

export default PaymentReturnPage;
