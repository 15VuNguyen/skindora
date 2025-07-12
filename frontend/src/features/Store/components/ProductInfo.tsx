import { Heart, Share2, Star } from "lucide-react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProductInfoProps {
  product: {
    name: string;
    price: number;
    rating: number;
    reviews: number;
    description: string;
  };
  quantity: number;
  handleDecrement: () => void;
  handleIncrement: () => void;
  addToCart: () => void;
  addToWishlist: () => void;
  stock: number;
}

export function ProductInfo({
  product,
  quantity,
  handleDecrement,
  handleIncrement,
  addToCart,
  addToWishlist,
  stock,
}: ProductInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="mb-4 flex items-center">
          <div className="mr-4 flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviews} đánh giá)
            </span>
          </div>
        </div>
        <p className="text-primary mb-4 text-2xl font-bold">{product.price.toLocaleString("vi-VN")}₫</p>
        <div className="mb-6">
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Số lượng</p>
          <QuantitySelector
            quantity={quantity}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            stock={stock}
          />
        </div>

        <div className="flex space-x-4">
          <Button className="flex-1" onClick={addToCart}>
            Thêm vào giỏ hàng
          </Button>
          <Button variant="outline" size="icon" onClick={addToWishlist}>
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface QuantitySelectorProps {
  quantity: number;
  handleDecrement: () => void;
  handleIncrement: () => void;
  stock: number;
}

function QuantitySelector({ quantity, handleDecrement, handleIncrement, stock }: QuantitySelectorProps) {
  return (
    <div className="flex items-center">
      <Button variant="outline" size="icon" onClick={handleDecrement} disabled={quantity <= 1}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="border-input border-y px-6 py-2">{quantity}</span>
      <Button variant="outline" size="icon" onClick={handleIncrement} disabled={quantity >= stock}>
        <Plus className="h-4 w-4" />
      </Button>
      <span className="ml-4 text-sm text-gray-500">Còn {stock} sản phẩm</span>
    </div>
  );
}
