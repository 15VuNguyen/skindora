import { Edit, Eye, Loader2, Package, Star, XCircle } from "lucide-react";
// Import XCircle for clear button
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchBrand } from "@/hooks/Brand/useFetchBrand";
import {
  type filter_dac_tinh_type_props,
  type filter_hsk_ingredient_props,
  type filter_hsk_product_type_props,
  type filter_hsk_size_props,
  type filter_hsk_skin_type_props,
  type filter_hsk_uses_props,
  type filter_origin_props,
} from "@/hooks/Filter/useFetchFilter";
import { useFetchFilter } from "@/hooks/Filter/useFetchFilter";
import { useFetchProduct } from "@/hooks/Product/useFetchProduct";

import { PaginationDemo } from "./Pagination";

export interface Product {
  _id: string;
  name_on_list: string;
  engName_on_list: string;
  price_on_list: string;
  image_on_list: string;
  hover_image_on_list: string;
  product_detail_url: string;
  productName_detail: string;
  engName_detail: string;
  description_detail: {
    rawHtml: string;
    plainText: string;
  };
  ingredients_detail: {
    rawHtml: string;
    plainText: string;
  };
  guide_detail: {
    rawHtml: string;
    plainText: string;
  };
  specification_detail: {
    rawHtml: string;
    plainText: string;
  };
  main_images_detail: string[];
  sub_images_detail: string[];
  filter_hsk_ingredient: string;
  filter_hsk_skin_type: string;
  filter_hsk_uses: string;
  filter_hsk_product_type: string;
  filter_origin: string;
}

export function ProductOverview() {
  const navigate = useNavigate();
  const {
    fetchListProduct,
    data,
    params,
    changePage,
    loading,
    changeBrand,
    changeDactinh,
    changeIngredient,
    changeOrigin,
    changeProductType,
    changeSize,
    changeUses,
    changeSkinType,
  } = useFetchProduct();
  const { data: brand, fetchListBrand } = useFetchBrand();

  // State for selected filter values
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedUses, setSelectedUses] = useState<string>("");
  const [selectedProductType, setSelectedProductType] = useState<string>("");
  const [selectedDactinh, setSelectedDactinh] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [selectedSkinType, setSelectedSkinType] = useState<string>("");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");

  // State for filter options data
  const [uses, setUses] = useState<filter_hsk_uses_props[]>([]);
  const [productType, setProductType] = useState<filter_hsk_product_type_props[]>([]);
  const [dactinh, setDactinh] = useState<filter_dac_tinh_type_props[]>([]);
  const [size, setSize] = useState<filter_hsk_size_props[]>([]);
  const [ingredient, setIngredient] = useState<filter_hsk_ingredient_props[]>([]);
  const [skinType, setSkinType] = useState<filter_hsk_skin_type_props[]>([]);
  const [origin, setOrigin] = useState<filter_origin_props[]>([]);

  const { data: filter, fetchFilter } = useFetchFilter();

  // State to manage expanded/collapsed sections for the filters (Accordion behavior)
  const [expandedSection, setExpandedSection] = useState<string | null>("skin-type"); // Default to 'Loại da' open initially

  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  // Helper component for collapsible filter sections with improved styling
  const FilterSection = ({
    title,
    children,
    sectionName,
    hasNoBorder = false,
  }: {
    title: string;
    children: React.ReactNode;
    sectionName: string;
    hasNoBorder?: boolean;
  }) => (
    <div className={`overflow-hidden ${hasNoBorder ? "" : "border-b border-gray-200"}`}>
      <button
        onClick={() => toggleSection(sectionName)}
        className="flex w-full items-center justify-between px-3 py-2 text-left font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-50 focus:outline-none"
      >
        <span>{title}</span>
        <span
          className={`transform transition-transform duration-200 ${expandedSection === sectionName ? "rotate-180" : "rotate-0"}`}
        >
          ▲
        </span>
      </button>
      {expandedSection === sectionName && (
        <div className="animate-slide-down bg-white px-3 pb-3">
          {" "}
          {/* Reduced top padding here */}
          <div className="custom-scrollbar max-h-[150px] overflow-y-auto">
            {" "}
            {/* Added max-height and overflow-y-auto */}
            {children}
          </div>
        </div>
      )}
    </div>
  );

  const formatPrice = (price: string) => {
    const priceValue = parseInt(price, 10);
    if (isNaN(priceValue)) {
      return "N/A";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(priceValue);
  };

  // Function to clear all selected filters
  const clearAllFilters = () => {
    setSelectedBrand("");
    setSelectedUses("");
    setSelectedProductType("");
    setSelectedDactinh("");
    setSelectedSize("");
    setSelectedIngredient("");
    setSelectedSkinType("");
    setSelectedOrigin("");
    // After clearing states, the useEffect below will trigger fetchListProduct with empty filters
  };

  useEffect(() => {
    fetchListBrand();
    fetchFilter();
  }, [fetchListBrand, fetchFilter]);

  useEffect(() => {
    fetchListProduct();
  }, [
    params.limit,
    params.page,
    params.filter_brand,
    params.filter_dactinh,
    params.filter_hsk_ingredient,
    params.filter_hsk_product_type,
    params.filter_hsk_size,
    params.filter_hsk_skin_type,
    params.filter_hsk_uses,
    params.filter_origin,
  ]);

  // Update product list based on filter changes
  useEffect(() => {
    changeBrand(selectedBrand);
    changeSkinType(selectedSkinType);
    changeIngredient(selectedIngredient);
    changeOrigin(selectedOrigin);
    changeDactinh(selectedDactinh);
    changeSize(selectedSize);
    changeProductType(selectedProductType);
    changeUses(selectedUses);
  }, [
    selectedBrand,
    selectedUses,
    selectedProductType,
    selectedDactinh,
    selectedSize,
    selectedIngredient,
    selectedSkinType,
    selectedOrigin,
    changeBrand,
    changeSkinType,
    changeIngredient,
    changeOrigin,
    changeDactinh,
    changeSize,
    changeProductType,
    changeUses,
  ]);

  useEffect(() => {
    if (filter?.filter_hsk_uses) {
      setUses(filter.filter_hsk_uses);
    }
    if (filter?.filter_hsk_product_type) {
      setProductType(filter.filter_hsk_product_type);
    }
    if (filter?.filter_dac_tinh) {
      setDactinh(filter.filter_dac_tinh);
    }
    if (filter?.filter_hsk_size) {
      setSize(filter.filter_hsk_size);
    }
    if (filter?.filter_hsk_ingredient) {
      setIngredient(filter.filter_hsk_ingredient);
    }
    if (filter?.filter_hsk_skin_type) {
      setSkinType(filter.filter_hsk_skin_type);
    }
    if (filter?.filter_origin) {
      setOrigin(filter.filter_origin);
    }
  }, [filter]);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50 p-4 lg:flex-row">
      {" "}
      {/* Added bg-gray-50 for subtle background */}
      {loading ? (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-lg">Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Sidebar - Left Column */}
          <div className="sticky top-4 h-fit w-full max-w-[300px] min-w-[250px] rounded-lg border border-gray-100 bg-white shadow-md lg:w-1/4">
            {" "}
            {/* Adjusted max-width, shadow, border, h-fit, sticky top */}
            <h3 className="border-b border-gray-200 p-4 text-lg font-bold text-gray-800">Bộ lọc</h3>{" "}
            {/* Smaller font size */}
            {/* Clear Filters Button */}
            <div className="border-b border-gray-200 p-3">
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={clearAllFilters}
              >
                <XCircle className="h-4 w-4" />
                Xóa tất cả bộ lọc
              </Button>
            </div>
            {/* Brand Filter (still a select as it's a long list usually) */}
            <FilterSection title="Thương hiệu" sectionName="brand">
              <Select onValueChange={setSelectedBrand} value={selectedBrand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  {brand.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.option_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterSection>
            {/* Skin Type Filter (as clickable items/checkboxes) */}
            <FilterSection title="Loại da" sectionName="skin-type">
              <div className="space-y-1">
                {skinType.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
                      // Smaller padding and font
                      selectedSkinType === item.filter_ID
                        ? "bg-blue-100 font-medium text-blue-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedSkinType(selectedSkinType === item.filter_ID ? "" : item.filter_ID)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </FilterSection>
            {/* Product Type Filter */}
            <FilterSection title="Loại sản phẩm" sectionName="product-type">
              <div className="space-y-1">
                {productType.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
                      // Smaller padding and font
                      selectedProductType === item.filter_ID
                        ? "bg-blue-100 font-medium text-blue-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedProductType(selectedProductType === item.filter_ID ? "" : item.filter_ID)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </FilterSection>
            {/* Ingredient Filter */}
            <FilterSection title="Thành phần" sectionName="ingredient">
              <div className="space-y-1">
                {ingredient.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
                      // Smaller padding and font
                      selectedIngredient === item.filter_ID
                        ? "bg-blue-100 font-medium text-blue-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedIngredient(selectedIngredient === item.filter_ID ? "" : item.filter_ID)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </FilterSection>
            {/* Uses Filter */}
            <FilterSection title="Công dụng" sectionName="uses">
              <div className="space-y-1">
                {uses.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
                      // Smaller padding and font
                      selectedUses === item.filter_ID
                        ? "bg-blue-100 font-medium text-blue-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedUses(selectedUses === item.filter_ID ? "" : item.filter_ID)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </FilterSection>
            {/* Origin Filter */}
            <FilterSection title="Xuất xứ" sectionName="origin">
              <div className="space-y-1">
                {origin.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
                      // Smaller padding and font
                      selectedOrigin === item.filter_ID
                        ? "bg-blue-100 font-medium text-blue-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedOrigin(selectedOrigin === item.filter_ID ? "" : item.filter_ID)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </FilterSection>
            {/* Dac Tinh Filter */}
            <FilterSection title="Đặc tính" sectionName="dactinh">
              <div className="space-y-1">
                {dactinh.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
                      // Smaller padding and font
                      selectedDactinh === item.filter_ID
                        ? "bg-blue-100 font-medium text-blue-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedDactinh(selectedDactinh === item.filter_ID ? "" : item.filter_ID)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </FilterSection>
            {/* Size Filter (last one, so no bottom border in FilterSection itself) */}
            <FilterSection title="Kích cỡ" sectionName="size" hasNoBorder={true}>
              <div className="space-y-1">
                {size.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
                      // Smaller padding and font
                      selectedSize === item.filter_ID
                        ? "bg-blue-100 font-medium text-blue-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedSize(selectedSize === item.filter_ID ? "" : item.filter_ID)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </FilterSection>
          </div>

          {/* Main Content - Right Column */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {" "}
              {/* Added sm:grid-cols-2 for better responsiveness */}
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Tổng sản phẩm</p>
                      <p className="text-3xl font-bold">{params.totalRecords}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Đang bán</p>
                      <p className="text-3xl font-bold">{params.totalRecords}</p>
                    </div>
                    <Star className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Sắp hết hàng</p>
                      <p className="text-3xl font-bold">23</p>
                    </div>
                    <Package className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Hết hàng</p>
                      <p className="text-3xl font-bold">68</p>
                    </div>
                    <Package className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sản phẩm mới nhất</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data && data.length > 0 ? (
                    data.map((product: Product) => (
                      <div
                        key={product._id}
                        className="flex items-center space-x-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
                      >
                        <img
                          src={product.image_on_list}
                          alt={product.name_on_list}
                          className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="line-clamp-2 font-medium text-gray-900">{product.name_on_list}</h3>
                          <p className="text-sm text-gray-600">{product.engName_on_list}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{product.filter_origin}</Badge>
                            <span className="text-lg font-semibold text-green-600">
                              {formatPrice(product.price_on_list)}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              console.log("Navigating to:", `/admin/${product._id}/detail`);
                              navigate(`/admin/${product._id}/detail`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/admin/${product._id}/update-product`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">Không có sản phẩm nào để hiển thị.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="mt-4">
              <PaginationDemo
                totalPages={Number(params.totalPages) ?? 1}
                currentPage={Number(params.page) ?? 1}
                onPageChange={changePage}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
