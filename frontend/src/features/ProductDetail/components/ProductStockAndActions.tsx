import { Check, LoaderCircle, Minus, Plus, ShoppingCart, XCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth.context";
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";
import type { Product } from "@/types";

import { ProductBadges } from "./ProductBadges";

interface ProductStockAndActionsProps {
  product: Product;
  filterIdToNameMap: Map<string, string>;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onBuyNow: () => void;
  isBuyingNow: boolean;
}

export function ProductStockAndActions({
  product,
  filterIdToNameMap,
  quantity,
  onQuantityChange,
  onBuyNow,
  isBuyingNow,
}: ProductStockAndActionsProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCartMutation();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to continue", {
        description: "You need to be logged in to add items to your cart.",
      });
      navigate("/auth/login", { state: { from: location }, replace: true });
      return;
    }
    addToCart({ ProductID: product._id, Quantity: quantity });
  };

  const isOutOfStock = (product.quantity || 0) <= 0;

  return (
    <div className="space-y-4">
      <p className="text-gray-700">{product.engName_detail}</p>
      <ProductBadges product={product} filterIdToNameMap={filterIdToNameMap} />

      {isOutOfStock ? (
        <div className="flex items-center font-medium text-red-600">
          <XCircle className="mr-1 h-5 w-5" />
          <span>Hết hàng</span>
        </div>
      ) : (
        <div className="flex items-center text-green-600">
          <Check className="mr-1 h-5 w-5" />
          <span>Còn hàng ({product.quantity} sản phẩm)</span>
        </div>
      )}

      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">Số lượng:</p>
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={quantity >= (product.quantity || 0)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <Button className="flex-1" onClick={handleAddToCart} disabled={isAddingToCart || isOutOfStock || isBuyingNow}>
          {isAddingToCart ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          disabled={isOutOfStock || isAddingToCart || isBuyingNow}
          onClick={onBuyNow}
        >
          {isBuyingNow ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isBuyingNow ? "Đang xử lý..." : "Mua ngay"}
        </Button>
      </div>
    </div>
  );
}
