import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  autoSlide?: boolean;
  slideInterval?: number;
}

export function ProductImageGallery({
  images,
  name,
  autoSlide = false,
  slideInterval = 4000,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (autoSlide && images.length > 1) {
      const interval = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % images.length);
      }, slideInterval);
      return () => clearInterval(interval);
    }
  }, [autoSlide, images.length, slideInterval]);

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="flex h-[400px] w-full items-center justify-center bg-gray-200 md:h-[500px]">
          <span className="text-gray-400">Không có hình ảnh</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {images.length > 1 && (
        <ScrollArea className="hidden h-[400px] w-24 rounded-md sm:flex md:h-[500px]">
          <div className="flex flex-col gap-2 p-1">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                  selectedImage === index ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img src={image} alt={`${name} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
      <div className="flex-1">
        <div className="group relative overflow-hidden rounded-lg bg-white shadow-md">
          <img
            src={images[selectedImage]}
            alt={`${name} - Image ${selectedImage + 1}`}
            className="h-[400px] w-full object-cover md:h-[500px]"
          />
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2 transform opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 transform opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute right-2 bottom-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
                Hình {selectedImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
