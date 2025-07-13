import { format } from "date-fns";
import { AlertCircle, ArrowLeft, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAddReviewMutation } from "@/hooks/mutations/useAddReviewMutation";
import { useRequestCancelOrderMutation } from "@/hooks/mutations/useRequestCancelOrderMutation";
import { useOrderByIdQuery } from "@/hooks/queries/useOrderByIdQuery";
import type { MyOrderDetail } from "@/services/orders.service";
import { addReviewedProductId, getReviewedProductIds } from "@/utils/reviewManager";

import { CancelDialog } from "./components/CancelDialog";
import { OrderActionsCard } from "./components/OrderActionsCard";
import { OrderItemsCard } from "./components/OrderItemsCard";
import { OrderSummaryCard } from "./components/OrderSummaryCard";
import { PageHeader } from "./components/PageHeader";
import { ReviewDialog } from "./components/ReviewDialog";
import { ShippingAddressCard } from "./components/ShippingAddressCard";
import { ShippingProgressCard } from "./components/ShippingProgressCard";

const generateShippingSteps = (status: string, orderDate: string, requireDate: string) => {
  const steps = [
    {
      status: "CONFIRMED",
      title: "Đã xác nhận đơn hàng",
      description: "Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.",
    },
    { status: "PROCESSING", title: "Đang xử lý", description: "Sản phẩm đang được đóng gói cẩn thận." },
    { status: "SHIPPING", title: "Đang vận chuyển", description: "Đơn hàng đang trên đường đến bạn." },
    { status: "DELIVERED", title: "Đã giao hàng", description: "Đơn hàng đã được giao thành công." },
  ];
  const statusHierarchy = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED", "FAILED"];
  const currentStatusIndex = statusHierarchy.indexOf(status);

  const getStepDate = (stepStatus: string) => {
    if (stepStatus === "CONFIRMED") return format(new Date(orderDate), "yyyy-MM-dd HH:mm");
    if (stepStatus === "DELIVERED" && status === "DELIVERED") return format(new Date(requireDate), "yyyy-MM-dd HH:mm");
    return "";
  };

  return steps.map((step) => {
    const stepIndexInHierarchy = statusHierarchy.indexOf(step.status.toUpperCase());
    return {
      ...step,
      completed: stepIndexInHierarchy < currentStatusIndex,
      current: stepIndexInHierarchy === currentStatusIndex,
      date: stepIndexInHierarchy <= currentStatusIndex ? getStepDate(step.status) : "",
    };
  });
};

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: orderResponse, isLoading, isError, error } = useOrderByIdQuery(orderId);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [reviewState, setReviewState] = useState<{ isOpen: boolean; product: MyOrderDetail["Products"] | null }>({
    isOpen: false,
    product: null,
  });
  const [reviewedProductIds, setReviewedProductIds] = useState<string[]>([]);

  const { mutate: requestCancel, isPending: isCancelling } = useRequestCancelOrderMutation();
  const { mutate: addReview, isPending: isSubmittingReview } = useAddReviewMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (orderId) {
      setReviewedProductIds(getReviewedProductIds(orderId));
    }
  }, [orderId]);

  const handleRequestCancellation = () => {
    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy đơn hàng.");
      return;
    }
    if (orderId) {
      requestCancel(
        { orderId, reason: cancelReason },
        {
          onSuccess: () => setIsCancelModalOpen(false),
        }
      );
    }
  };

  const openReviewModal = (product: MyOrderDetail["Products"]) => setReviewState({ isOpen: true, product });

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (orderId && reviewState.product) {
      addReview(
        { orderId, productId: reviewState.product.productId, payload: { rating, comment } },
        {
          onSuccess: (result) => {
            if (result.isOk()) {
              const reviewedProductId = reviewState.product!.productId;
              addReviewedProductId(orderId, reviewedProductId);
              setReviewedProductIds((prev) => [...prev, reviewedProductId]);
              setReviewState({ isOpen: false, product: null });
            }
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground mt-4">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (isError || !orderResponse?.result?.order) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="text-destructive h-16 w-16" />
        <h2 className="mt-4 text-2xl font-bold">Không tìm thấy đơn hàng</h2>
        <p className="text-muted-foreground mt-2">
          {error?.message || "Chúng tôi không tìm thấy đơn hàng bạn yêu cầu."}
        </p>
        <Button onClick={() => navigate("/profile")} variant="outline" className="mt-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại đơn hàng của tôi
        </Button>
      </div>
    );
  }

  const { order, orderDetail } = orderResponse.result;

  const shippingSteps = generateShippingSteps(order.Status, order.created_at, order.RequireDate);
  const finalTotal = parseFloat(order.TotalPrice);
  const discountAmount = parseFloat(order.DiscountValue || "0");
  const subtotal = finalTotal + discountAmount;

  const shippingFee = subtotal > 500000 ? 0 : 30000;
  const grandTotal = subtotal - discountAmount + shippingFee;
  const isCancelable = (order.Status === "PENDING" || order.Status === "CONFIRMED") && !order.CancelRequest;

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <PageHeader orderId={order._id} orderDate={order.created_at} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ShippingProgressCard steps={shippingSteps} />
              <OrderItemsCard
                orderDetails={orderDetail}
                orderStatus={order.Status}
                onOpenReviewModal={openReviewModal}
                reviewedProductIds={reviewedProductIds}
              />
            </div>
            <div className="space-y-6 lg:col-span-1">
              <ShippingAddressCard address={order.ShipAddress} />
              <OrderSummaryCard
                orderTotal={subtotal}
                shippingFee={shippingFee}
                discount={discountAmount}
                grandTotal={grandTotal}
                paymentMethod={order.PaymentMethod}
                requireDate={order.RequireDate}
                voucherCode={order.VoucherSnapshot?.code}
              />
              <OrderActionsCard
                isCancelable={isCancelable}
                onCancel={() => setIsCancelModalOpen(true)}
                isCancelling={isCancelling}
                cancelRequestStatus={order.CancelRequest?.status}
              />
            </div>
          </div>
        </div>
      </div>

      <CancelDialog
        isOpen={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        onConfirm={handleRequestCancellation}
        reason={cancelReason}
        setReason={setCancelReason}
        isCancelling={isCancelling}
      />

      {reviewState.isOpen && reviewState.product && (
        <ReviewDialog
          isOpen={reviewState.isOpen}
          onOpenChange={(open) => setReviewState({ ...reviewState, isOpen: open })}
          productName={reviewState.product.name}
          onSubmit={handleReviewSubmit}
          isSubmitting={isSubmittingReview}
        />
      )}
    </>
  );
};

export default OrderTracking;
