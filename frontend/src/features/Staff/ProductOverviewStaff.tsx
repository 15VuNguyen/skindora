import { Eye, Loader2, XCircle } from "lucide-react";
// Import XCircle for clear button
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   type filter_hsk_ingredient_props,
//   type filter_hsk_product_type_props,
//   type filter_hsk_size_props,
//   type filter_hsk_skin_type_props,
//   type filter_hsk_uses_props,
//   type filter_origin_props,
// } from "@/hooks/Filter/useFetchActiveFilter";
import type {
  filter_brand_props,
  filter_dac_tinh_type_props,
  filter_hsk_ingredient_props,
  filter_hsk_product_type_props,
  filter_hsk_size_props,
  filter_hsk_skin_type_props,
  filter_hsk_uses_props,
  filter_origin_props,
} from "@/hooks/Filter/useFetchAllFilter";
import { useFetchAllFilter } from "@/hooks/Filter/useFetchAllFilter";
import { useFetchProductStaff } from "@/hooks/Staff/Product/useFetchProductStaff";
import type { ProductFE } from "@/types/product";

import { PaginationDemo } from "../Admin/components/Pagination";

// export interface Product {
//   _id: string;
//   name_on_list: string;
//   engName_on_list: string;
//   price_on_list: string;
//   image_on_list: string;
//   hover_image_on_list: string;
//   product_detail_url: string;
//   productName_detail: string;
//   engName_detail: string;
//   description_detail: {
//     rawHtml: string;
//     plainText: string;
//   };
//   ingredients_detail: {
//     rawHtml: string;
//     plainText: string;
//   };
//   guide_detail: {
//     rawHtml: string;
//     plainText: string;
//   };
//   specification_detail: {
//     rawHtml: string;
//     plainText: string;
//   };
//   main_images_detail: string[];
//   sub_images_detail: string[];
//   filter_hsk_ingredient: string;
//   filter_hsk_skin_type: string;
//   filter_hsk_uses: string;
//   filter_hsk_product_type: string;
//   filter_origin: string;
// }

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
  } = useFetchProductStaff();
  // const { data: brand, fetchListBrand } = useFetchBrand();

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedUses, setSelectedUses] = useState<string>("");
  const [selectedProductType, setSelectedProductType] = useState<string>("");
  const [selectedDactinh, setSelectedDactinh] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [selectedSkinType, setSelectedSkinType] = useState<string>("");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");

  const [uses, setUses] = useState<filter_hsk_uses_props[]>([]);
  const [productType, setProductType] = useState<filter_hsk_product_type_props[]>([]);
  const [dactinh, setDactinh] = useState<filter_dac_tinh_type_props[]>([]);
  const [size, setSize] = useState<filter_hsk_size_props[]>([]);
  const [ingredient, setIngredient] = useState<filter_hsk_ingredient_props[]>([]);
  const [skinType, setSkinType] = useState<filter_hsk_skin_type_props[]>([]);
  const [origin, setOrigin] = useState<filter_origin_props[]>([]);
  const [brand, setBrand] = useState<filter_brand_props[]>([]);
  const { data: filter, fetchFilter } = useFetchAllFilter();

  const [expandedSection, setExpandedSection] = useState<string | null>("skin-type");

  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

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
          <div className="custom-scrollbar max-h-[150px] overflow-y-auto"> {children}</div>
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

  const clearAllFilters = () => {
    setSelectedBrand("");
    setSelectedUses("");
    setSelectedProductType("");
    setSelectedDactinh("");
    setSelectedSize("");
    setSelectedIngredient("");
    setSelectedSkinType("");
    setSelectedOrigin("");
    setSelectedBrand("");
  };

  useEffect(() => {
    fetchFilter();
  }, [fetchFilter]);

  useEffect(() => {
    fetchListProduct();
  }, [
    params.limit,
    params.page,
    params.filter_brand,
    params.filter_dac_tinh,
    params.filter_hsk_ingredients,
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
    if (filter?.filter_brand) {
      setBrand(filter.filter_brand);
    }
  }, [filter]);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50 p-4 lg:flex-row">
      {loading ? (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-lg">Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="sticky top-4 h-fit w-full max-w-[300px] min-w-[250px] rounded-lg border border-gray-100 bg-white shadow-md lg:w-1/4">
            {" "}
            <h3 className="border-b border-gray-200 p-4 text-lg font-bold text-gray-800">Bộ lọc</h3>{" "}
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
                    <SelectItem key={b.filter_ID} value={b.filter_ID}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterSection>
            <FilterSection title="Loại da" sectionName="skin-type">
              <div className="space-y-1">
                {skinType.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
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
            <FilterSection title="Loại sản phẩm" sectionName="product-type">
              <div className="space-y-1">
                {productType.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
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
            <FilterSection title="Công dụng" sectionName="uses">
              <div className="space-y-1">
                {uses.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
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
            <FilterSection title="Đặc tính" sectionName="dactinh">
              <div className="space-y-1">
                {dactinh.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
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
            <FilterSection title="Kích cỡ" sectionName="size" hasNoBorder={true}>
              <div className="space-y-1">
                {size.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
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

          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sản phẩm mới nhất</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data && data.length > 0 ? (
                    data.map((product: ProductFE) => (
                      <div
                        key={product._id}
                        className="flex items-center space-x-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
                      >
                        <img
                          src={product.image_on_list}
                          alt={product.name_on_list}
                          onClick={() => {
                            navigate(`/staff/${product._id}/detail`);
                          }}
                          className="h-16 w-16 flex-shrink-0 cursor-pointer rounded-lg object-cover"
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
                              navigate(`/staff/${product._id}/detail`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(`/staff/${product._id}/update-product`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button> */}
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
