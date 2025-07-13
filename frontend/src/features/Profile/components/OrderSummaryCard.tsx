import { format } from "date-fns";
import { ChevronRight, Package, Tag } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { MyOrder, OrderStatus } from "@/services/orders.service";

const getStatusBadgeVariant = (status: OrderStatus): React.ComponentProps<typeof Badge>["variant"] => {
  switch (status) {
    case "DELIVERED":
      return "complete";
    case "CANCELLED":
    case "FAILED":
      return "destructive";
    case "SHIPPING":
      return "default";
    case "PROCESSING":
      return "waiting";
    case "PENDING":
      return "pending";
    case "CONFIRMED":
      return "secondary";
    case "RETURNED":
      return "outline";
    default:
      return "secondary";
  }
};

interface OrderSummaryCardProps {
  order: MyOrder;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order }) => {
  const navigate = useNavigate();

   const orderTotal = parseInt(order.TotalPrice || "0", 10);
 

  const totalItems = order.orderDetail.reduce((acc, item) => acc + parseInt(item.Quantity), 0);

  return (
    <Card
      className="hover:border-primary cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md"
      onClick={() => navigate(`/orders/tracking/${order.orderId}`)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            {order.orderDetail.length > 0 && (
              <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center">
                {order.orderDetail
                  .slice(0, 3)
                  .reverse()
                  .map((detail, index) => (
                    <img
                      key={detail._id}
                      src={detail.Products.image}
                      alt={detail.Products.name}
                      className="absolute h-12 w-12 rounded-md border-2 border-white object-cover shadow-sm"
                      style={{
                        zIndex: index,
                        transform: `translateX(${index * 8}px) scale(${1 - index * 0.05})`,
                      }}
                    />
                  ))}
              </div>
            )}
            <div className="min-w-0">

              <p className="text-primary flex items-center gap-2 text-sm font-semibold">
                <Tag className="h-4 w-4" />
                Order ID: {order.orderId.slice(-8).toUpperCase()}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {format(new Date(order.OrderDate), "MMMM d, yyyy")}
              </p>
              <p className="text-muted-foreground mt-1 flex items-center text-xs">
                <Package className="mr-1.5 h-3 w-3" />
                {totalItems} {totalItems > 1 ? "items" : "item"}
              </p>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
            <Badge variant={getStatusBadgeVariant(order.orderStatus)} className="w-fit capitalize">
              {order.orderStatus.toLowerCase().replace("_", " ")}
            </Badge>
            <div className="flex flex-1 items-center justify-end gap-4 sm:flex-none">
              <span className="text-lg font-bold">{orderTotal.toLocaleString("vi-VN")}₫</span>
              <ChevronRight className="text-muted-foreground h-5 w-5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
