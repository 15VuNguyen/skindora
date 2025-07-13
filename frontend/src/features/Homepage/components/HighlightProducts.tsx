import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ProductCard } from "@/components/ui/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";
import { useAllProductsQuery } from "@/hooks/queries/useAllProductsQuery";

function HighlightProductsCarousel() {
  const { data: paginatedData, isLoading, isError, error } = useAllProductsQuery(1, 10, {});
  const { mutate: addToCart } = useAddToCartMutation();
  const navigate = useNavigate();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const handleAddToCart = (productId: string) => {
    setLoadingProductId(productId);
    addToCart(
      { ProductID: productId, Quantity: 1 },
      {
        onSettled: () => {
          setLoadingProductId(null);
        },
      }
    );
  };
  const handleCardClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderCircle className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-12 text-center text-red-600">
        <p>
          Could not load products. Please try again later. <br />{" "}
          <span className="text-sm text-gray-500">({error.message})</span>
        </p>
      </div>
    );
  }

  const products = paginatedData?.data ?? [];

  if (products.length === 0) {
    return (
      <div className="flex justify-center py-12 text-center text-gray-500">
        <p>No featured products available at the moment.</p>
      </div>
    );
  }

  return (
    <Carousel className="mb-12" plugins={[Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false })]}>
      <CarouselContent className="py-4">
        {products.map((product) => (
          <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/4">
            <ProductCard
              product={product}
              variant="carousel"
              onAddToCart={handleAddToCart}
              onCardClick={handleCardClick}
              isAddingToCart={loadingProductId === product._id}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default function HighlightProducts(): React.JSX.Element {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="prose-h2 text-2xl font-bold">Sản phẩm nổi bật</h2>
          <Link to="/products" className="text-primary flex items-center hover:underline">
            Xem tất cả
            <ChevronRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
        <HighlightProductsCarousel />
      </div>
    </section>
  );
}
