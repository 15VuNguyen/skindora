
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  productTypes: Array<{ id: string; name: string }>;
  toggleProductType: (productTypeName: string) => void;
}

export function MobileMenu({
  mobileMenuOpen,
  setMobileMenuOpen,
  setSelectedCategory,
  categories,
  productTypes,
  toggleProductType
}: MobileMenuProps) {
  if (!mobileMenuOpen) return null;
  
  return (
    <div className="fixed inset-0 z-30 bg-white pt-16">
      <div className="container mx-auto px-4 py-4">
        <div className="space-y-4">
          <Link 
            to="/home" 
            className="block text-lg font-medium p-2 hover:bg-gray-100 rounded"
            onClick={() => setMobileMenuOpen(false)}
          >
            Trang chủ
          </Link>
          
          <h3 className="text-lg font-medium mt-6 mb-2">Danh mục</h3>
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setSelectedCategory(category);
                setMobileMenuOpen(false);
              }}
            >
              {category}
            </Button>
          ))}
          
          <h3 className="text-lg font-medium mt-6 mb-2">Loại sản phẩm</h3>
          <div className="max-h-80 overflow-y-auto">
            {productTypes.map((type) => (
              <Button
                key={type.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  toggleProductType(type.name);
                  setMobileMenuOpen(false);
                }}
              >
                {type.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
