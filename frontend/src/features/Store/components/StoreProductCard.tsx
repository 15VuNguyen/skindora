import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter,CardHeader } from "@/components/ui/card";
import type { Product } from "@/types";

interface StoreProductCardProps {
  product: Product;
  onAddToCart: (e: React.MouseEvent) => void;
  onCardClick: (productId: string) => void;
}

export function StoreProductCard({ product, onAddToCart, onCardClick }: StoreProductCardProps) {
  const onSale = false;
  const originalPrice = parseInt(product.price_on_list) * 1.2;

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
      onClick={() => onCardClick(product._id)}
    >
      <CardHeader>
      <div className="relative">
        <img
          src={product.image_on_list}
          alt={product.engName_on_list}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {onSale && <Badge className="absolute top-2 left-2 bg-red-500">Giảm giá</Badge>}
      </div>
      </CardHeader>
      <CardContent className="p-4 pb-2">
        <p className="text-muted-foreground mb-1 truncate text-sm">{product.filter_hsk_product_type}</p>
        <h3 className="line-clamp-2 h-12 font-medium">{product.name_on_list}</h3>
        <div className="mt-2 h-10">
          {onSale ? (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-red-500">
                {parseInt(product.price_on_list).toLocaleString("vi-VN")}₫
              </span>
              <span className="text-muted-foreground text-sm line-through">
                {originalPrice.toLocaleString("vi-VN")}₫
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold">{parseInt(product.price_on_list).toLocaleString("vi-VN")}₫</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={onAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  );
}
