import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchProductByID } from "@/hooks/Product/useFetchProductByID";

// Hàm tiện ích để định dạng tiền tệ
const formatCurrency = (price: string | number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { FetchProductByID, data, loading } = useFetchProductByID(String(id));
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    if (id) {
      FetchProductByID();
    }
  }, [id, FetchProductByID]);

  useEffect(() => {
    if (data?.main_images_detail?.[0]) {
      setMainImage(data.main_images_detail[0]);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-destructive text-xl">Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mt-3 ml-10">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin/products");
          }}
        >
          <ArrowLeft />
          Quay lại
        </Button>
      </div>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-lg border">
              <img
                src={mainImage || data.image_on_list}
                alt={data.productName_detail}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {data.sub_images_detail.slice(0, 5).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(data.main_images_detail[idx])}
                  className={`overflow-hidden rounded-md border-2 ${
                    mainImage === data.main_images_detail[idx] ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl leading-tight font-bold lg:text-3xl">
                    {data.productName_detail}
                  </CardTitle>
                  <p className="text-muted-foreground">{data.engName_detail}</p>
                </div>

                <div className="flex gap-2"></div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Sản phẩm:</span>
                  <span className="font-mono text-xl">{data._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá niêm yết:</span>
                  <span className="text-xl font-semibold text-green-600">{formatCurrency(data.price_on_list)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Thương hiệu:</span>
                  <span className="text-xl">{data.filter_brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Loại da:</span>
                  <span className="text-xl">{data.filter_hsk_skin_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Công dụng:</span>
                  <span className="text-xl">{data.filter_hsk_uses}</span>
                </div>
              </div>
              <Separator />
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Mô tả sản phẩm</TabsTrigger>
              <TabsTrigger value="ingredients">Thành phần</TabsTrigger>
              <TabsTrigger value="guide">Hướng dẫn sử dụng</TabsTrigger>
              <TabsTrigger value="specs">Thông số</TabsTrigger>
            </TabsList>
            <Separator className="my-4" />
            <TabsContent value="description" className="prose container max-w-full">
              <div dangerouslySetInnerHTML={{ __html: data.description_detail.rawHtml }} />
            </TabsContent>
            <TabsContent value="ingredients" className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: data.ingredients_detail.rawHtml }} />
            </TabsContent>
            <TabsContent value="guide" className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: data.guide_detail.rawHtml }} />
            </TabsContent>
            <TabsContent value="specs" className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: data.specification_detail.rawHtml }} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
