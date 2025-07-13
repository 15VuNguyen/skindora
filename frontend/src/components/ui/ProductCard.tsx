import { type VariantProps, cva } from "class-variance-authority";
import { Heart, LoaderCircle, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const cardVariants = cva("group flex cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg", {
  variants: {
    variant: {
      default: "h-full",
      carousel: "h-full hover:shadow-primary/25 hover:border-primary/40",
      wishlist: "h-full  p-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ProductCardProps extends VariantProps<typeof cardVariants> {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onRemoveFromWishlist?: (productId: string) => void;
  onCardClick?: (productId: string) => void;
  isAddingToCart?: boolean;
  isRemovingFromWishlist?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant,
  onAddToCart,
  onRemoveFromWishlist,
  onCardClick,
  isAddingToCart = false,
  isRemovingFromWishlist = false,
  className,
}: ProductCardProps) {
  const handleActionClick = (e: React.MouseEvent, action?: (id: string) => void) => {
    e.stopPropagation();
    if (action) {
      action(product._id);
    }
  };

  return (
    <Card className={cn(cardVariants({ variant }), className)} onClick={() => onCardClick?.(product._id)}>
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={product.image_on_list}
            alt={product.name_on_list}
            className="h-56 w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
          {variant === "wishlist" && onRemoveFromWishlist && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
              onClick={(e) => handleActionClick(e, onRemoveFromWishlist)}
              disabled={isRemovingFromWishlist}
            >
              {isRemovingFromWishlist ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4 fill-current" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4 pb-2">
        <h3 className="mb-2 line-clamp-2 h-12 font-medium">{product.name_on_list}</h3>

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
        {onAddToCart && (
          <Button
            className="w-full"
            onClick={(e) => handleActionClick(e, onAddToCart)}
            disabled={product.quantity === 0 || isAddingToCart}
          >
            {isAddingToCart ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            Thêm vào giỏ hàng
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
