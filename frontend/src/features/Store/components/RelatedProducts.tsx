import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

export function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products
          .filter((p) => p.id !== currentProductId)
          .slice(0, 4)
          .map((relatedProduct) => (
            <Link to={`/product/${relatedProduct.id}`} key={relatedProduct.id} className="group">
              <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-1 line-clamp-2 font-medium text-gray-900">{relatedProduct.name}</h3>
                  <p className="text-primary font-bold">${relatedProduct.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
