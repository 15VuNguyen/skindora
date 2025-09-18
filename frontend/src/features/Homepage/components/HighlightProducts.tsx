import Autoplay from "embla-carousel-autoplay";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ProductCard } from "@/components/ui/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useAddToCartMutation } from "@/hooks/mutations/useAddToCartMutation";
import { useAllProductsQuery } from "@/hooks/queries/useAllProductsQuery";

interface SectionHeaderProps {
  title: [string, string];
  description: string;
}

function SectionHeader({ title, description }: SectionHeaderProps) {
  const firstLetter = title[1].charAt(0);
  const restOfWord = title[1].slice(1);

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="relative">
        <span className="absolute top-2 left-30 text-xl font-semibold text-gray-700">{title[0]}</span>

        <h2 className="flex items-baseline">
          <span className="font-herr text-9xl font-normal text-gray-900">{firstLetter}</span>
          <span className="-ml-4 text-5xl font-bold text-gray-800">{restOfWord}</span>
        </h2>
      </div>

      <p className="mt-4 max-w-xs text-gray-600">{description}</p>
    </div>
  );
}

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
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-center text-red-600">
        <p>
          Could not load products. <br /> <span className="text-sm text-gray-500">({error.message})</span>
        </p>
      </div>
    );
  }

  const products = paginatedData?.data ?? [];
  if (products.length === 0) return <div className="text-center text-gray-500">No featured products available.</div>;

  return (
    <Carousel plugins={[Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false })]}>
      <CarouselContent className="-ml-4 py-4">
        {products.map((product) => (
          <CarouselItem key={product._id} className="pl-4 md:basis-1/2 lg:basis-1/3">
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
      <CarouselPrevious className="left-[-20px]" />
      <CarouselNext className="right-[-20px]" />
    </Carousel>
  );
}

export default function HighlightProducts(): React.JSX.Element {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <SectionHeader
              title={["Best Seller", "Products"]}
              description="At Skindora, we carefully curate products that not only nourish your skin but also elevate your self-care experience."
            />
          </div>

          <div className="lg:col-span-3">
            <HighlightProductsCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
