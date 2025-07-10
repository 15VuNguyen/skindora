import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Frown, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { useVNPayMutation } from "@/hooks/mutations/useVNPayMutation";
import { useZaloPayMutation } from "@/hooks/mutations/useZaloPayMutation";
import { useCheckoutMutation } from "@/hooks/queries/useCheckoutMutation";
import { usePreparedOrderQuery } from "@/hooks/queries/usePreparedOrderQuery";
import type { CheckoutPayload, ProductInOrder } from "@/services/orders.service";
import type { VNPayPayload, ZaloPayPayload } from "@/services/paymentService";

import { CheckoutForm } from "./components/CheckoutForm";
import { CheckoutOrderSummary } from "./components/CheckoutOrderSummary";

const checkoutFormSchema = z.object({
  ShipAddress: z.string().min(10, { message: "Shipping address must be at least 10 characters." }),
  Description: z.string().optional(),
  RequireDate: z.date({ required_error: "A delivery date is required." }),
  PaymentMethod: z.enum(["COD", "ZALOPAY", "VNPAY"], { required_error: "Please select a payment method." }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
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
      toast.error("Your checkout session has expired. Please return to the cart.");
      return;
    }

    const totalAmount = orderDetails.FinalPrice || orderDetails.TotalPrice;

    switch (formData.PaymentMethod) {
      case "COD": {
        const payload: CheckoutPayload = {
          ...formData,
          RequireDate: formData.RequireDate.toISOString(),
          type: "cart",
          PaymentStatus: "UNPAID",
        };
        createOrderWithCOD(payload, {
          onSuccess: () => navigate("/profile"),
        });
        break;
      }
      case "ZALOPAY": {
        // Corrected: Replaced 'any' with the imported 'ProductInOrder' type
        const zaloPayPayload: ZaloPayPayload = {
          orderDetails: orderDetails.Products.map((p: ProductInOrder) => ({
            _id: p.ProductID,
            ProductID: p.ProductID,
            Quantity: p.Quantity,
            Discount: 0,
          })),
          total: totalAmount,
        };
        payWithZaloPay(zaloPayPayload);
        break;
      }
      case "VNPAY": {
        const vnPayPayload: VNPayPayload = {
          amount: totalAmount,
          orderDescription: "Payment for Skindora Order",
          orderType: "billpayment",
          language: "vn",
        };
        payWithVNPay(vnPayPayload);
        break;
      }
      default:
        toast.error("Invalid payment method selected.");
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
        <h2 className="mb-2 text-xl font-bold">Checkout Session Expired</h2>
        <p className="text-muted-foreground mb-6">
          Your cart may have changed. Please return to your cart to continue.
        </p>
        <Button variant="outline" onClick={() => navigate("/cart")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Cart
        </Button>
      </div>
    );
  }

  const orderDetails = preparedOrderResponse.result;
  const shippingFee = orderDetails.TotalPrice > 500000 ? 0 : 30000;
  const summaryDetails = {
    subtotal: orderDetails.TotalPrice,
    shipping: shippingFee,
    discount: orderDetails.DiscountAmount || 0,
    total: (orderDetails.FinalPrice || orderDetails.TotalPrice) + shippingFee,
    items: orderDetails.Products,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" onClick={() => navigate("/cart")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
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
