
import { ProductImageGallery } from "./ProductImageGallery";

interface ProductImageProps {
  image?: string | string[];
  images?: string[];
  name: string;
}

export function ProductImage({ image, images, name }: ProductImageProps) {
 
  const imageArray = images || (Array.isArray(image) ? image : [image || "/placeholder.svg"]);
  
  return <ProductImageGallery images={imageArray} name={name} />;
}
