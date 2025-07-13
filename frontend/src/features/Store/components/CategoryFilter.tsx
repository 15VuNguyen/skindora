
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  productTypes: Array<{ id: string; name: string }>;
  selectedProductTypes: string[];
  toggleProductType: (productTypeName: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
  productTypes,
  selectedProductTypes,
  toggleProductType
}: CategoryFilterProps) {
  return (
    <div className="hidden md:flex mb-6 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className="mr-2"
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </Button>
      ))}
      
    
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Loại sản phẩm {selectedProductTypes.length > 0 && `(${selectedProductTypes.length})`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end">
          <DropdownMenuLabel>Loại sản phẩm</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[400px] overflow-y-auto">
            <DropdownMenuGroup>
              {productTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type.id}
                  checked={selectedProductTypes.includes(type.name)}
                  onCheckedChange={() => toggleProductType(type.name)}
                  className="capitalize"
                >
                  {type.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
