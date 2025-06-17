import { Edit, Eye, Package, Star } from "lucide-react";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useFetchProduct } from "@/hooks/useFetchProduct";

import { PaginationDemo } from "./Pagination";

// Định nghĩa interface cho Product
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
  main_images_detail: string[]; // Giả sử đây là mảng các chuỗi URL
  sub_images_detail: string[]; // Giả sử đây là mảng các chuỗi URL
  filter_hsk_ingredient: string;
  filter_hsk_skin_type: string;
  filter_hsk_uses: string;
  filter_hsk_product_type: string;
  filter_origin: string;
}

interface ProductOverviewProps {
  onSelectProduct: (product: Product) => void; // Sử dụng Product interface
  onEditProduct: () => void;
}

export function ProductOverview({ onSelectProduct, onEditProduct }: ProductOverviewProps) {
  // Giả sử useFetchProduct trả về data có kiểu Product[]
  const { fetchListProduct, data, params, changePage, loading } = useFetchProduct();

  const formatPrice = (price: string) => {
    // Thêm kiểm tra nếu price không hợp lệ
    const priceValue = parseInt(price, 10);
    if (isNaN(priceValue)) {
      return "N/A";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(priceValue);
  };

  useEffect(() => {
    fetchListProduct();
  }, [params.page]); // Giả sử fetchListProduct đã được tối ưu với useCallback

  useEffect(() => {
    // Dành cho việc debug, có thể giữ lại hoặc xóa đi
    console.log(data);
  }, [data]);

  const handleEdit = (product: Product) => {
    onSelectProduct(product);
    onEditProduct();
  };

  return (
    <div>
      {loading ? (
        <div className="text-primary flex h-[300px] w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Tổng sản phẩm</p>
                    {/* TODO: Cập nhật các giá trị này từ API nếu có */}
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

          {/* Phần danh sách sản phẩm mới nhất */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sản phẩm mới nhất</span>
                <Button variant="outline" size="sm">
                  Xem tất cả
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Lặp qua dữ liệu sản phẩm từ API */}
                {data && data.length > 0 ? (
                  data.map((product: Product) => (
                    <div
                      key={product._id} // Sử dụng _id làm key cho mỗi item
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
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Hiển thị khi không có dữ liệu
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
      )}
    </div>
  );
}
