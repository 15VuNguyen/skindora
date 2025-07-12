import { AlertCircle, LoaderCircle, ShoppingBag } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth.context";
import { useMyOrdersQuery } from "@/hooks/queries/useMyOrdersQuery";

import { OrderSummaryCard } from "./OrderSummaryCard";

export const OrderHistoryTab: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: ordersData, isLoading, isError, error } = useMyOrdersQuery(isAuthenticated);
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
        <p className="text-muted-foreground mt-4">Đang tải lịch sử đơn hàng...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle /> Không thể tải đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error?.message || "Đã xảy ra lỗi không mong muốn."}</p>
        </CardContent>
      </Card>
    );
  }

  const orders = ordersData || [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-xl font-semibold">Chưa có đơn hàng nào</h3>
        <p className="text-muted-foreground mt-2">Bạn chưa đặt đơn hàng nào với chúng tôi.</p>
        <Button variant="link" className="mt-4" onClick={() => navigate("/products")}>
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Đơn hàng của bạn</h2>
      {orders.map((order) => (
        <OrderSummaryCard key={order.orderId} order={order} />
      ))}
    </div>
  );
};
