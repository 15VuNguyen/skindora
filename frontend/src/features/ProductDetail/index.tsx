import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth.context";
import { useAddToWishlistMutation } from "@/hooks/mutations/useAddToWishlistMutation";
import { useBuyNowMutation } from "@/hooks/mutations/useBuyNowMutation";
import { useRemoveFromWishlistMutation } from "@/hooks/mutations/useRemoveFromWishlistMutation";
import { useFilterOptionsQuery } from "@/hooks/queries/useFilterOptionsQuery";
import { useProductByIdQuery } from "@/hooks/queries/useProductByIdQuery";
import { useProductReviewsQuery } from "@/hooks/queries/useProductReviewsQuery";
import { useWishlistQuery } from "@/hooks/queries/useWishlistQuery";

import { ProductHeader } from "./components/ProductHeader";
import { ProductImageGallery } from "./components/ProductImageGallery";
import { ProductPrice } from "./components/ProductPrice";
import { ProductShippingAndReturns } from "./components/ProductShippingAndReturns";
import { ProductStockAndActions } from "./components/ProductStockAndActions";
import { ProductTabs } from "./components/ProductTabs";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError, error } = useProductByIdQuery(id);
  const { data: filterOptions } = useFilterOptionsQuery();
  const { data: paginatedReviews } = useProductReviewsQuery(id);

  const { data: wishlist, isLoading: isWishlistLoading } = useWishlistQuery(isAuthenticated);
  const { mutate: addToWishlist, isPending: isAddingToWishlist } = useAddToWishlistMutation();
  const { mutate: removeFromWishlist, isPending: isRemovingFromWishlist } = useRemoveFromWishlistMutation();
  const { mutate: buyNow, isPending: isBuyingNow } = useBuyNowMutation();

  const { averageRating, reviewCount } = useMemo(() => {
    const reviews = paginatedReviews?.data || [];
    if (reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      averageRating: totalRating / reviews.length,
      reviewCount: reviews.length,
    };
  }, [paginatedReviews]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    buyNow({ productId: product._id, quantity });
  };

  const isInWishlist = useMemo(() => {
    return !!(product && wishlist?.includes(product._id));
  }, [product, wishlist]);

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to save items to your wishlist.");
      navigate("/auth/login", { state: { from: location }, replace: true });
      return;
    }
    if (product) {
      if (isInWishlist) {
        removeFromWishlist([product._id]);
      } else {
        addToWishlist([product._id]);
      }
    }
  };

  const filterIdToNameMap = useMemo(() => {
    if (!filterOptions) return new Map<string, string>();
    const map = new Map<string, string>();
    Object.values(filterOptions).forEach((category) => {
      if (Array.isArray(category)) {
        category.forEach((option) => {
          map.set(option.filter_ID, option.name);
        });
      }
    });
    return map;
  }, [filterOptions]);

  if (isLoading || (isAuthenticated && isWishlistLoading)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoaderCircle className="text-primary h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Không tìm thấy sản phẩm</h1>
        <p className="mb-6 text-gray-500">{error?.message || "Sản phẩm bạn tìm kiếm không tồn tại."}</p>
        <Button variant="outline" asChild>
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại cửa hàng
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <ProductImageGallery images={product.main_images_detail} name={product.productName_detail} autoSlide={false} />
        <div className="space-y-6">
          <ProductHeader
            productName={product.productName_detail}
            averageRating={averageRating}
            reviewCount={reviewCount}
            onToggleWishlist={handleToggleWishlist}
            isAddingToWishlist={isAddingToWishlist}
            isRemovingFromWishlist={isRemovingFromWishlist}
            isInWishlist={isInWishlist}
          />
          <ProductPrice product={product} />
          <Separator />
          <ProductStockAndActions
            product={product}
            filterIdToNameMap={filterIdToNameMap}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onBuyNow={handleBuyNow}
            isBuyingNow={isBuyingNow}
          />
          <Separator />
          <ProductShippingAndReturns />
        </div>
      </div>
      <ProductTabs product={product} />
    </div>
  );
};

export default ProductDetailPage;
