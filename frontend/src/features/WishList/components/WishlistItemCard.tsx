import { Heart, LoaderCircle, ShoppingCart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "@/types";

interface WishlistItemCardProps {
  product: Product;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
  onProductClick: (id: string) => void;
  isRemoving: boolean;
  isAddingToCart: boolean;
}

export function WishlistItemCard({
  product,
  onRemove,
  onAddToCart,
  onProductClick,
  isRemoving,
  isAddingToCart,
}: WishlistItemCardProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(product._id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product._id);
  };

  return (
    <Card
      className="group flex cursor-pointer flex-col overflow-hidden p-0 transition-shadow hover:shadow-lg"
      onClick={() => onProductClick(product._id)}
    >
      <div className="relative">
        <img
          src={product.image_on_list}
          alt={product.name_on_list}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.onSale && <Badge className="absolute top-2 left-2 bg-red-500">Giảm giá</Badge>}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4 fill-current" />}
        </Button>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        <p className="text-muted-foreground mb-1 text-sm">{product.category || "Chưa phân loại"}</p>
        <h3 className="mb-2 line-clamp-2 h-12 font-medium">{product.name_on_list}</h3>

        {product.rating && (
          <div className="mb-2 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-600">({product.reviews || 0} đánh giá)</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold">{parseInt(product.price_on_list).toLocaleString("vi-VN")}₫</span>
          {product.quantity !== undefined && (
            <span className={`text-xs ${product.quantity > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart} disabled={product.quantity === 0 || isAddingToCart}>
          {isAddingToCart ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          Thêm vào giỏ hàng
        </Button>
      </CardFooter>
    </Card>
  );
}
