import type { Product } from "@/types";

interface ProductPriceProps {
  product: Product;
}

export function ProductPrice({ product }: ProductPriceProps) {
  return (
    <div className="space-y-2">
      <p className="text-2xl font-bold">{parseInt(product.price_on_list).toLocaleString("vi-VN")}₫</p>
      {product.originalPrice && (
        <p className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString("vi-VN")}₫</p>
      )}
    </div>
  );
}
