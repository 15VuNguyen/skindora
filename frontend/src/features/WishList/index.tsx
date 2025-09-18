import { ArrowLeft, Heart, LoaderCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth.context";
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";
import { useRemoveFromWishlistMutation } from "@/hooks/mutations/useRemoveFromWishlistMutation";
import { useWishlistProductsQuery } from "@/hooks/queries/useWishlistProductsQuery";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const { data: wishlistItems, isLoading, isError } = useWishlistProductsQuery(isAuthenticated);
  const { mutate: removeFromWishlist, isPending: isRemoving } = useRemoveFromWishlistMutation();
  const { mutate: addToCart } = useAddToCartMutation();

  const handleRemove = (id: string) => {
    removeFromWishlist([id]);
  };

  const handleAddToCart = (id: string) => {
    setLoadingProductId(id);
    addToCart(
      { ProductID: id, Quantity: 1 },
      {
        onSettled: () => {
          setLoadingProductId(null);
        },
      }
    );
  };
  const handleProductClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <LoaderCircle className="text-primary h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (isError || !wishlistItems) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="text-destructive mb-2 text-2xl font-bold">Không thể tải danh sách yêu thích</h2>
        <p className="text-muted-foreground mb-6">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Heart className="mb-4 h-16 w-16 text-gray-400" />
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Danh sách yêu thích của bạn đang trống</h2>
        <p className="mb-6 max-w-md text-center text-gray-500">
          Khám phá các sản phẩm và thêm vào danh sách yêu thích của bạn!
        </p>
        <Button onClick={() => navigate("/products")}>Khám phá sản phẩm</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => navigate("/products")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tiếp tục mua sắm
        </Button>
        <h1 className="text-2xl font-bold">Danh sách yêu thích ({wishlistItems.length} sản phẩm)</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
        {wishlistItems.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            variant="wishlist"
            onRemoveFromWishlist={handleRemove}
            onAddToCart={handleAddToCart}
            onCardClick={handleProductClick}
            isRemovingFromWishlist={isRemoving}
            isAddingToCart={loadingProductId === item._id}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => navigate("/cart")} className="mr-4">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Xem giỏ hàng
        </Button>
      </div>
    </div>
  );
};

export default WishlistPage;
