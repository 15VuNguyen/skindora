import { Package, Truck } from "lucide-react";

export function ProductShippingAndReturns() {
  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <Truck className="h-5 w-5 text-gray-600" />
        <div>
          <p className="font-medium">Miễn phí vận chuyển</p>
          <p className="text-sm text-gray-600">Áp dụng cho đơn hàng từ 500.000₫</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Package className="h-5 w-5 text-gray-600" />
        <div>
          <p className="font-medium">Đổi trả</p>
          <p className="text-sm text-gray-600">Chính sách đổi trả trong 30 ngày</p>
        </div>
      </div>
    </div>
  );
}
