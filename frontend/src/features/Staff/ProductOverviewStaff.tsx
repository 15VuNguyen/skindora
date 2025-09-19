// Import XCircle for clear button
import { Eye, Loader2, Package, Star, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useFetchStaticsProduct } from "@/hooks/Product/useFetchStatics";
import { useFetchProductStaff } from "@/hooks/Staff/Product/useFetchProductStaff";
import type { ProductFE } from "@/types/product";

import { PaginationDemo } from "../Admin/components/Pagination";

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
  const { data: statics, fetchStaticsProductByStaff } = useFetchStaticsProduct();
  const [expandedSection, setExpandedSection] = useState<string | null>("skin-type");

  const toggleSection = (sectionName: string) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const FilterSection = ({
    title,
    children,
    sectionName,
    hasNoBorder = false,
    count = 0,
  }: {
    title: string;
    children: React.ReactNode;
    sectionName: string;
    hasNoBorder?: boolean;
    count?: number;
  }) => (
    <div className={`overflow-hidden ${hasNoBorder ? "" : "border-b border-gray-200"}`}>
      <button
        onClick={() => toggleSection(sectionName)}
        className="flex w-full items-center justify-between px-3 py-2 text-left font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-50 focus:outline-none"
      >
        <span>{title}</span>
        <div className="flex gap-3">
          <div>
            <span
              className={`transform transition-transform duration-200 ${expandedSection === sectionName ? "rotate-180" : "rotate-0"}`}
            >
              ▲
            </span>
          </div>
          <div className="pt-0.5">
            {count > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </div>
        </div>
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
    fetchStaticsProductByStaff();
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
            <FilterSection title="Thương hiệu" sectionName="brand" count={selectedBrand ? 1 : 0}>
              <div className="space-y-1">
                {brand.map((item) => (
                  <div
                    key={item.filter_ID}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition-colors duration-200 ${
                      selectedBrand === item.filter_ID
                        ? "bg-blue-100 font-medium text-blue-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedBrand(selectedBrand === item.filter_ID ? "" : item.filter_ID)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </FilterSection>
            <FilterSection title="Loại da" sectionName="skin-type" count={selectedSkinType ? 1 : 0}>
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
            <FilterSection title="Loại sản phẩm" sectionName="product-type" count={selectedProductType ? 1 : 0}>
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
            <FilterSection title="Thành phần" sectionName="ingredient" count={selectedIngredient ? 1 : 0}>
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
            <FilterSection title="Công dụng" sectionName="uses" count={selectedUses ? 1 : 0}>
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
            <FilterSection title="Xuất xứ" sectionName="origin" count={selectedOrigin ? 1 : 0}>
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
            <FilterSection title="Đặc tính" sectionName="dactinh" count={selectedDactinh ? 1 : 0}>
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
            <FilterSection title="Kích cỡ" sectionName="size" hasNoBorder={true} count={selectedSize ? 1 : 0}>
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {" "}
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Tổng sản phẩm</p>
                      <p className="text-3xl font-bold">{statics?.totalProducts}</p>
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
                      <p className="text-3xl font-bold">{statics?.onSale}</p>
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
                      <p className="text-3xl font-bold">{statics?.lowStock}</p>
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
                      <p className="text-3xl font-bold">{statics?.outOfStock}</p>
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
