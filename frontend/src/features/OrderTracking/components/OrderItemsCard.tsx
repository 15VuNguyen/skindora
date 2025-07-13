import { CheckCircle, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MyOrderDetail } from "@/services/orders.service";

interface OrderItemsCardProps {
  orderDetails: MyOrderDetail[];
  orderStatus: string;
  onOpenReviewModal: (product: MyOrderDetail["Products"]) => void;
  reviewedProductIds: string[];
}

export const OrderItemsCard = ({
  orderDetails,
  orderStatus,
  onOpenReviewModal,
  reviewedProductIds,
}: OrderItemsCardProps) => (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Package className="h-5 w-5" /> Sản phẩm trong đơn hàng
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {orderDetails.map((item) => (
          <div key={item._id} className="flex gap-4 rounded-lg border bg-white p-4">
            <img src={item.Products.image} alt={item.Products.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <h4 className="font-medium">{item.Products.name}</h4>
              <p className="text-sm text-gray-500">Số lượng: {item.Quantity}</p>
              <p className="text-lg font-bold">{parseInt(item.UnitPrice).toLocaleString("vi-VN")}₫</p>
            </div>
            {orderStatus === "DELIVERED" && (
              <div className="flex items-center">
                {reviewedProductIds.includes(item.Products.productId) ? (
                  <Button variant="outline" size="sm" disabled>
                    <CheckCircle className="mr-2 h-4 w-4" /> Đã đánh giá
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => onOpenReviewModal(item.Products)}>
                    Viết đánh giá
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
