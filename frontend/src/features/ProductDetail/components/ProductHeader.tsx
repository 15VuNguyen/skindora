import { Heart, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { StarRating } from "./StarRating";

interface ProductHeaderProps {
  productName: string;
  averageRating: number;
  reviewCount: number;
  onToggleWishlist: () => void;
  isAddingToWishlist: boolean;
  isRemovingFromWishlist: boolean;
  isInWishlist: boolean;
}

export function ProductHeader({
  productName,
  averageRating,
  reviewCount,
  onToggleWishlist,
  isAddingToWishlist,
  isRemovingFromWishlist,
  isInWishlist,
}: ProductHeaderProps) {
  const isWishlistLoading = isAddingToWishlist || isRemovingFromWishlist;

  return (
    <div>
      <div className="flex items-start justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={onToggleWishlist}
          disabled={isWishlistLoading}
        >
          {isWishlistLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <Heart
              className={`h-5 w-5 transition-colors ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"}`}
            />
          )}
        </Button>
      </div>
      <h1 className="mt-2 text-3xl font-bold">{productName}</h1>
      <div className="mt-2 flex items-center">
        <StarRating rating={averageRating} />
        <span className="ml-2 text-sm text-gray-600">
          {averageRating.toFixed(1)} ({reviewCount} đánh giá)
        </span>
      </div>
    </div>
  );
}
