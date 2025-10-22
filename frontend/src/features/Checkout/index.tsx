import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Frown, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { useVNPayMutation } from "@/hooks/mutations/useVNPayMutation";
import { useZaloPayMutation } from "@/hooks/mutations/useZaloPayMutation";
import { useCheckoutMutation } from "@/hooks/queries/useCheckoutMutation";
import { usePreparedOrderQuery } from "@/hooks/queries/usePreparedOrderQuery";
import type { CheckoutPayload, ProductInOrder } from "@/services/orders.service";
import { type PaymentRequestPayload } from "@/services/paymentService";

import { CheckoutForm } from "./components/CheckoutForm";
import { CheckoutOrderSummary } from "./components/CheckoutOrderSummary";

const checkoutFormSchema = z.object({
  ShipAddress: z.string().min(10, { message: "Shipping address must be at least 10 characters." }),
  PhoneNumber: z.string().optional(),
  Description: z.string().optional(),
  RequireDate: z.date({ required_error: "A delivery date is required." }),
  PaymentMethod: z.enum(["COD", "ZALOPAY", "VNPAY"], { required_error: "Please select a payment method." }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appliedVoucher = location.state?.appliedVoucher;
  const { data: preparedOrderResponse, isLoading: isSummaryLoading, isError } = usePreparedOrderQuery(true);

  const { mutate: createOrderWithCOD, isPending: isSubmittingCOD } = useCheckoutMutation();
  const { mutate: payWithZaloPay, isPending: isSubmittingZaloPay } = useZaloPayMutation();
  const { mutate: payWithVNPay, isPending: isSubmittingVNPay } = useVNPayMutation();
  const isSubmitting = isSubmittingCOD || isSubmittingZaloPay || isSubmittingVNPay;

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { PaymentMethod: "COD" },
  });

  const onSubmit = (formData: CheckoutFormData) => {
    const orderDetails = preparedOrderResponse?.result;
    if (!orderDetails) {
      toast.error("Phiên thanh toán của bạn đã hết hạn. Vui lòng quay lại giỏ hàng.");
      return;
    }

    const basePayload: CheckoutPayload = {
      ...formData,
      RequireDate: formData.RequireDate.toISOString(),
      PaymentStatus: "UNPAID",
      type: "cart",
    };

    if (appliedVoucher) {
      basePayload.voucherCode = appliedVoucher.code;
    }

    switch (formData.PaymentMethod) {
      case "COD": {
        const payload: CheckoutPayload = {
          ...basePayload,
          PaymentStatus: "UNPAID",
        };
        createOrderWithCOD(payload, {
          onSuccess: (result) => {
            if (result.isOk()) {
              toast.success("Đặt hàng thành công!", {
                description: "Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng trong thời gian sớm nhất.",
              });
              navigate("/profile");
            } else {
              toast.error("Thanh toán thất bại", {
                description: result.error.message || "Có lỗi khi đặt hàng. Vui lòng thử lại.",
              });
            }
          },
        });
        break;
      }

      case "ZALOPAY": {
        const payload: PaymentRequestPayload = {
          ...basePayload,
          PaymentMethod: "ZALOPAY",
          orderDetails: orderDetails.Products.map((p: ProductInOrder) => ({
            _id: p.ProductID,
            ProductID: p.ProductID,
            Quantity: p.Quantity,
            Discount: 0,
          })),
          total: orderDetails.FinalPrice || orderDetails.TotalPrice,
        };
        payWithZaloPay(payload);
        break;
      }
      case "VNPAY": {
        const payload: PaymentRequestPayload = {
          ...basePayload,
          PaymentMethod: "VNPAY",
          amount: orderDetails.FinalPrice || orderDetails.TotalPrice,
        };
        payWithVNPay(payload);
        break;
      }
      default:
        toast.error("Phương thức thanh toán không hợp lệ.");
    }
  };

  if (isSummaryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError || !preparedOrderResponse?.result) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <Frown className="text-destructive mb-4 h-16 w-16" />
        <h2 className="mb-2 text-xl font-bold">Phiên thanh toán đã hết hạn</h2>
        <p className="text-muted-foreground mb-6">
          Giỏ hàng của bạn có thể đã thay đổi. Vui lòng quay lại giỏ hàng để tiếp tục.
        </p>
        <Button variant="outline" onClick={() => navigate("/cart")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại giỏ hàng
        </Button>
      </div>
    );
  }

  const orderDetails = preparedOrderResponse.result;
  const discountAmount =
    appliedVoucher && orderDetails.TotalPrice >= Number(appliedVoucher.minOrderValue)
      ? appliedVoucher.discountType === "PERCENTAGE"
        ? Math.min(
            (orderDetails.TotalPrice * Number(appliedVoucher.discountValue)) / 100,
            Number(appliedVoucher.maxDiscountAmount) || Infinity
          )
        : Number(appliedVoucher.discountValue)
      : 0;

  const finalTotal = orderDetails.TotalPrice - discountAmount;
  const summaryDetails = {
    subtotal: orderDetails.TotalPrice,
    discount: discountAmount,
    total: finalTotal > 0 ? finalTotal : 0,
    items: orderDetails.Products,
    voucherCode: appliedVoucher?.code,
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" onClick={() => navigate("/cart")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại giỏ hàng
          </Button>
          <h1 className="text-2xl font-bold">Thanh toán</h1>
        </div>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CheckoutForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
          </div>
          <div className="lg:col-span-1">
            <CheckoutOrderSummary {...summaryDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
