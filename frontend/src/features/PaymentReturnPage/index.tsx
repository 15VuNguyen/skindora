import { AlertTriangle, CheckCircle, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useVerifyVNPayMutation } from "@/hooks/mutations/useVerifyVNPayMutation";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate: verifyPayment, isPending, isSuccess, isError, data, error } = useVerifyVNPayMutation();

  useEffect(() => {
    const vnpayData: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      vnpayData[key] = value;
    });

    if (vnpayData["vnp_ResponseCode"] && vnpayData["vnp_TxnRef"]) {
      verifyPayment(vnpayData);
    } else {
      navigate("/error");
    }
  }, [searchParams, verifyPayment, navigate]);

  const renderContent = () => {
    if (isPending) {
      return (
        <>
          <LoaderCircle className="text-primary h-16 w-16 animate-spin" />
          <h1 className="mt-6 text-2xl font-bold">Đang xác thực thanh toán...</h1>
          <p className="text-muted-foreground mt-2">
            Vui lòng chờ trong giây lát để chúng tôi xác nhận giao dịch của bạn.
          </p>
        </>
      );
    }

    if (isError) {
      return (
        <>
          <AlertTriangle className="text-destructive h-16 w-16" />
          <h1 className="mt-6 text-2xl font-bold">Xác thực thanh toán thất bại</h1>
          <p className="text-muted-foreground mt-2">{error?.message || "Đã xảy ra lỗi khi xác thực thanh toán."}</p>
          <Button onClick={() => navigate("/profile")} className="mt-6">
            Về trang cá nhân
          </Button>
        </>
      );
    }

    if (isSuccess && data?.isOk() && data.value.data.code === "00") {
      return (
        <>
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h1 className="mt-6 text-2xl font-bold">Thanh toán thành công!</h1>
          <p className="text-muted-foreground mt-2">
            Đơn hàng của bạn đã được xác nhận. Bạn sẽ được chuyển hướng trong giây lát.
          </p>
          <Button onClick={() => navigate("/profile/orders")} className="mt-6">
            Xem đơn hàng của tôi
          </Button>
        </>
      );
    }

    return (
      <>
        <AlertTriangle className="text-destructive h-16 w-16" />
        <h1 className="mt-6 text-2xl font-bold">Thanh toán thất bại</h1>
        <p className="text-muted-foreground mt-2">
          {data?.isOk() ? data.value.data.message : "Giao dịch không thành công."}
        </p>
        <Button onClick={() => navigate("/checkout")} variant="outline" className="mt-6">
          Thử lại
        </Button>
      </>
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      {renderContent()}
    </div>
  );
};

export default PaymentReturnPage;
