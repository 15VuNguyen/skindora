import { format } from "date-fns";
import { CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryCardProps {
  orderTotal: number;
  grandTotal: number;
  paymentMethod: string;
  requireDate: string;
  discount?: number;
  voucherCode?: string;
}

export const OrderSummaryCard = ({
  orderTotal,
  grandTotal,
  paymentMethod,
  requireDate,
  discount,
  voucherCode,
}: OrderSummaryCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Tóm tắt đơn hàng</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between">
        <span>Tạm tính:</span>
        <span>{orderTotal.toLocaleString("vi-VN")}₫</span>
      </div>
      {typeof discount === "number" && discount > 0 && (
        <div className="flex items-center justify-between text-sm font-medium text-green-600">
          <span>Giảm giá {voucherCode && `(${voucherCode})`}:</span>
          <span>-{discount.toLocaleString("vi-VN")}₫</span>
        </div>
      )}
     
      <Separator />
      <div className="flex justify-between text-lg font-bold">
        <span>Tổng cộng:</span>
        <span>{grandTotal.toLocaleString("vi-VN")}₫</span>
      </div>
      <div className="flex items-center justify-between pt-2">
        <span className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="h-4 w-4 text-gray-500" /> Phương thức thanh toán
        </span>
        <Badge variant="outline" className="font-medium">
          {paymentMethod}
        </Badge>
      </div>
      <div className="pt-2">
        <p className="text-sm text-gray-600">
          Ngày giao dự kiến: <span className="font-medium">{format(new Date(requireDate), "PPP")}</span>
        </p>
      </div>
    </CardContent>
  </Card>
);
