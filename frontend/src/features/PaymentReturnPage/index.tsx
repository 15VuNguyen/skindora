import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { config } from "@/config/config";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

    const backendVerificationUrl = `${config.apiBaseUrl}/payment/vnpay_return?${searchParams.toString()}`;

    if (vnp_ResponseCode === "00") {
      window.location.href = backendVerificationUrl;
    } else {
      toast.error("Thanh toán thất bại", {
        description: "Giao dịch không thành công từ phía VNPay.",
      });
      navigate("/checkout");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <LoaderCircle className="text-primary h-16 w-16 animate-spin" />
      <h1 className="mt-6 text-2xl font-bold">Đang hoàn tất thanh toán...</h1>
      <p className="text-muted-foreground mt-2">Vui lòng chờ trong giây lát. Quá trình này hoàn toàn tự động.</p>
    </div>
  );
};

export default PaymentReturnPage;
