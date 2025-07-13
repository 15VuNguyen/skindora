
import { Button } from "@/components/ui/button";

export function ProductBanner() {
  return (
    <div className="rounded-lg overflow-hidden bg-gradient-to-r from-primary to-accent mb-8 shadow-lg">
      <div className="p-8 md:p-12 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Khuyến mãi tháng 5</h2>
        <p className="mb-4">Giảm giá đến 30% cho các sản phẩm chăm sóc da</p>
        <Button className="bg-white text-primary hover:bg-gray-100">
          Xem ngay
        </Button>
      </div>
    </div>
  );
}
