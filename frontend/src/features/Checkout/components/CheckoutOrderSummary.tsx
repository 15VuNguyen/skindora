import { Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProductInOrder } from "@/services/orders.service";

interface CheckoutOrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  items: ProductInOrder[];
  voucherCode?: string;
}

export function CheckoutOrderSummary({
  subtotal,
  discount,
  total,
  items,
  voucherCode,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="sticky top-24 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Tóm tắt đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-muted-foreground">Tạm tính:</span>
            <span className="font-semibold">{subtotal.toLocaleString("vi-VN")}₫</span>
          </div>
          
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm font-medium text-green-600">
              <span>
                Giảm giá {voucherCode && <span className="font-normal text-green-700">({voucherCode})</span>}:
              </span>
              <span className="font-semibold">-{discount.toLocaleString("vi-VN")}₫</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span className="text-primary">Tổng cộng:</span>
            <span className="text-primary">{total.toLocaleString("vi-VN")}₫</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Package className="h-5 w-5 text-primary" /> Sản phẩm trong đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-60 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div key={item.ProductID} className="flex items-center justify-between text-sm py-1">
              <p className="truncate pr-2 font-medium">
                {item.Name.length > 20
                  ? `${item.Name.slice(0, 15)}...`
                  : item.Name}{" "}
                <span className="text-muted-foreground font-normal">x {item.Quantity}</span>
              </p>
              <p className="font-semibold whitespace-nowrap text-right">
                {(item.PricePerUnit * item.Quantity).toLocaleString("vi-VN")}₫
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
