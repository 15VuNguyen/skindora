import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchFilter } from "@/hooks/Filter/useFetchActiveFilter";
import httpClient from "@/lib/axios";
import type { ProductFormValues } from "@/lib/productSchema";
import { productSchema } from "@/lib/productSchema";
import type { Brand } from "@/types/Filter/brand";
import type { DacTinh } from "@/types/Filter/dactinh";
import type { Ingredient } from "@/types/Filter/ingredient";
import type { Origin } from "@/types/Filter/origin";
import type { ProductType } from "@/types/Filter/productType";
import type { Size } from "@/types/Filter/size";
import type { SkinType } from "@/types/Filter/skinType";

import TiptapEditor from "./TiptapEditor";

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uses, setUses] = useState<Brand[]>([]);
  const [productType, setProductType] = useState<ProductType[]>([]);
  const [dactinh, setDactinh] = useState<DacTinh[]>([]);
  const [size, setSize] = useState<Size[]>([]);
  const [ingredient, setIngredient] = useState<Ingredient[]>([]);
  const [skinType, setSkinType] = useState<SkinType[]>([]);
  const [origin, setOrigin] = useState<Origin[]>([]);
  const [brand, setBrand] = useState<Brand[]>([]);
  const { data: filter, fetchFilter } = useFetchFilter();

  useEffect(() => {
    fetchFilter();
  }, [fetchFilter]);
  useEffect(() => {
    if (filter?.filter_brand) {
      // Access .data here
      setBrand(filter.filter_brand);
    }
    if (filter?.filter_hsk_uses) {
      // Access .data here
      setUses(filter.filter_hsk_uses);
    }
    if (filter?.filter_hsk_product_type) {
      // Access .data here
      setProductType(filter.filter_hsk_product_type);
    }
    if (filter?.filter_dac_tinh) {
      // Access .data here
      setDactinh(filter.filter_dac_tinh);
    }
    if (filter?.filter_hsk_size) {
      // Access .data here
      setSize(filter.filter_hsk_size);
    }
    if (filter?.filter_hsk_ingredients) {
      // Access .data here
      setIngredient(filter.filter_hsk_ingredients);
    }
    if (filter?.filter_hsk_skin_type) {
      // Access .data here - THIS IS THE PRIMARY FIX FOR YOUR ERROR
      setSkinType(filter.filter_hsk_skin_type);
    }
    if (filter?.filter_origin) {
      // Access .data here
      setOrigin(filter.filter_origin);
    }
  }, [filter]);
  const navigate = useNavigate();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name_on_list: "",
      engName_on_list: "",
      price_on_list: "",
      quantity: undefined,
      image_on_list: "",
      hover_image_on_list: "",
      productName_detail: "",
      engName_detail: "",
      description_detail: { rawHtml: "", plainText: "" },
      ingredients_detail: { rawHtml: "", plainText: "" },
      guide_detail: { rawHtml: "", plainText: "" },
      specification_detail: { rawHtml: "", plainText: "" },
      main_images_detail: [],
      sub_images_detail: [],
      filter_brand: "",
      filter_hsk_skin_type: "",
      filter_hsk_uses: "",
      filter_hsk_product_type: "",
      filter_origin: "",
      filter_hsk_ingredients: "",
      filter_dac_tinh: "",
      filter_hsk_size: "",
    },
  });

  const {
    fields: mainImageFields,
    append: appendMainImage,
    remove: removeMainImage,
  } = useFieldArray({
    control: form.control,
    name: "main_images_detail",
  });
  const {
    fields: subImageFields,
    append: appendSubImage,
    remove: removeSubImage,
  } = useFieldArray({
    control: form.control,
    name: "sub_images_detail",
  });

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    const payload = {
      ...values,
      main_images_detail: values.main_images_detail.map((img) => img.value),
      sub_images_detail: values.sub_images_detail.map((img) => img.value),
    };
    const optionalFilters = [
      "filter_brand",
      "filter_hsk_skin_type",
      "filter_hsk_uses",
      "filter_hsk_product_type",
      "filter_origin",
      "filter_hsk_ingredient",
      "filter_dac_tinh",
      "filter_hsk_size",
    ];
    (optionalFilters as (keyof typeof payload)[]).forEach((key) => {
      if (typeof payload[key] === "string" && payload[key] === "") {
        delete payload[key];
      }
    });
    console.log("FINAL PAYLOAD TO SERVER:", payload);

    try {
      const response = await httpClient.post("/admin/manage-products/create-new-product", payload);
      if (response.status === 200 || response.status === 201) {
        toast.success("Thành công!", {
          description: "Sản phẩm đã được thêm vào hệ thống.",
        });
        form.reset();
      }
    } catch (error: any) {
      const errorResponse = error.response?.data;
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi không xác định xảy ra.";
      console.log(error.response.data);
      const errorDetails = Object.entries(errorResponse?.errors || {})
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join("\n");

      toast.error("Thất bại!", {
        description: `${errorMessage}\n${errorDetails}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // const ImageUrlInput = ({ control, name, label, placeholder }: any) => (
  //   <FormField
  //     control={control}
  //     name={name}
  //     render={({ field }) => (
  //       <FormItem>
  //         <FormLabel>{label}</FormLabel>
  //         <FormControl>
  //           <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
  //             <Input {...field} placeholder={placeholder} style={{ flex: 1 }} />
  //             {field.value && typeof field.value === "string" && (
  //               <img
  //                 src={field.value}
  //                 alt="Xem trước"
  //                 style={{
  //                   width: "80px", // Giảm kích thước một chút cho gọn
  //                   height: "80px",
  //                   objectFit: "cover",
  //                   borderRadius: "8px",
  //                   border: "1px solid #e2e8f0",
  //                 }}
  //                 // Ẩn ảnh nếu URL không hợp lệ
  //                 onError={(e) => {
  //                   e.currentTarget.style.display = "none";
  //                 }}
  //                 // Hiện lại nếu URL được sửa đúng
  //                 onLoad={(e) => {
  //                   e.currentTarget.style.display = "block";
  //                 }}
  //               />
  //             )}
  //           </div>
  //         </FormControl>
  //         <FormMessage />
  //       </FormItem>
  //     )}
  //   />
  // );
  const EditorWithPreview = ({ control, name, label, error }: any) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
              <TiptapEditor
                value={field.value?.rawHtml || ""}
                onChange={(newContent: { rawHtml: string; plainText: string }) => {
                  field.onChange(newContent);
                }}
              />

              <div className="prose bg-muted max-w-none rounded-md border p-3">
                <h4 className="text-muted-foreground mb-2 text-sm font-semibold italic">Xem trước trực tiếp</h4>
                {field.value && field.value.rawHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: field.value.rawHtml }} />
                ) : (
                  <p className="text-muted-foreground text-sm">Nội dung xem trước sẽ hiện ở đây...</p>
                )}
              </div>
            </div>

            {error && <p className="text-destructive mt-2 text-sm font-medium">{error}</p>}

            <br />
          </FormItem>
        )}
      />
    );
  };
  return (
    <div>
      <div className="mt-3 ml-10">
        <Button
          variant="ghost"
          className="hover:bg-transparent hover:text-green-600"
          onClick={() => {
            navigate("/admin/products");
          }}
        >
          <ArrowLeft />
          Quay lại
        </Button>
      </div>
      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h1 className="mb-6 text-3xl font-bold">Thêm sản phẩm mới</h1>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin sản phẩm</CardTitle>
                <Typography>Cung cấp các thông tin chi tiết cho sản phẩm của bạn.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Tên sản phẩm</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name_on_list"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên danh sách (name_on_list):</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productName_detail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên sản phẩm (productName_detail):</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="engName_on_list"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên tiếng Anh (engName_on_list):</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="engName_detail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Tiếng Anh chi tiết(engName_detail):</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin kinh doanh</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="price_on_list"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá bán (price_on_list):</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lượng tồn kho(quantity):</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Hình ảnh</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="image_on_list"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Ảnh chính (image_on_list):</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} />
                          </FormControl>
                          <FormMessage />

                          {field.value && typeof field.value === "string" && (
                            <img
                              src={field.value}
                              alt="Image Preview"
                              className="mt-4 rounded-md border"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          )}
                        </FormItem>
                      )}
                    />
                    {/* <ImageUrlInput
                      control={form.control}
                      name="hover_image_on_list"
                      label="URL Ảnh khi hover (danh sách)"
                      placeholder="Dán URL ảnh khi hover..."
                    /> */}
                    <FormField
                      control={form.control}
                      name="hover_image_on_list"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Ảnh khi hover (hover_image_on_list):</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} />
                          </FormControl>
                          <FormMessage />

                          {field.value && typeof field.value === "string" && (
                            <img
                              src={field.value}
                              alt="Image Preview"
                              className="mt-4 rounded-md border"
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="product_detail_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL trang chi tiết sản phẩm</FormLabel>
                        <FormControl>
                          <div className="flex w-full items-center gap-2">
                            <div className="relative flex-grow">
                              <Link2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input
                                {...field}
                                placeholder="https://your-shop.com/products/my-product"
                                className="pl-10"
                              />
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              disabled={!field.value}
                              onClick={() => window.open(field.value, "_blank")}
                            >
                              Kiểm tra
                            </Button>
                          </div>
                        </FormControl>
                        <Typography>Đây là đường dẫn đầy đủ mà khách hàng sẽ truy cập để xem sản phẩm.</Typography>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nội dung chi tiết (HTML)</CardTitle>
                <Typography>Soạn thảo nội dung ở khung bên trái và xem kết quả hiển thị ở khung bên phải.</Typography>
              </CardHeader>
              <CardContent className="space-y-8">
                {" "}
                {/* Tăng khoảng cách để thoáng hơn */}
                <EditorWithPreview
                  control={form.control}
                  name="description_detail"
                  label="Mô tả chi tiết (description_detail):"
                  error={
                    form.formState.errors.description_detail?.rawHtml?.message ||
                    form.formState.errors.description_detail?.message
                  }
                />
                <EditorWithPreview
                  control={form.control}
                  name="ingredients_detail"
                  label="Thành phần (ingredients_detail):"
                  error={
                    form.formState.errors.ingredients_detail?.rawHtml?.message ||
                    form.formState.errors.ingredients_detail?.message
                  }
                />
                <EditorWithPreview
                  control={form.control}
                  name="guide_detail"
                  label="Hướng dẫn sử dụng(guide_detail):"
                  error={
                    form.formState.errors.guide_detail?.rawHtml?.message || form.formState.errors.guide_detail?.message
                  }
                />
                <EditorWithPreview
                  control={form.control}
                  name="specification_detail"
                  label="Thông số sản phẩm(specification_detail):"
                  error={
                    form.formState.errors.specification_detail?.rawHtml?.message ||
                    form.formState.errors.specification_detail?.message
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách hình ảnh chi tiết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Hình ảnh chính (main_images_detail):</h3>
                  {mainImageFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`main_images_detail.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="mb-2 flex items-center gap-4">
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/image.jpg" />
                          </FormControl>
                          <Button type="button" variant="destructive" onClick={() => removeMainImage(index)}>
                            Xóa
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  {form.formState.errors.main_images_detail && (
                    <p className="text-destructive mt-2 text-sm font-medium">
                      {form.formState.errors.main_images_detail.message}
                    </p>
                  )}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendMainImage({ value: "" })}>
                    Thêm ảnh chính
                  </Button>
                </div>
                <div>
                  <h3 className="mt-4 mb-2 font-semibold">Hình ảnh phụ (sub_images_detail):</h3>
                  {subImageFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`sub_images_detail.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="mb-2 flex items-center gap-4">
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/image.jpg" />
                          </FormControl>
                          <Button type="button" variant="destructive" onClick={() => removeSubImage(index)}>
                            Xóa
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  {form.formState.errors.sub_images_detail && (
                    <p className="text-destructive mt-2 text-sm font-medium">
                      {form.formState.errors.sub_images_detail.message}
                    </p>
                  )}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendSubImage({ value: "" })}>
                    Thêm ảnh phụ
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filter Information (Filter IDs)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="filter_brand"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-lg font-semibold text-blue-700">
                        Thương hiệu-(filter_brand) <span className="text-sm text-gray-500">(Optional)</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {brand.map((brand) => (
                            <SelectItem
                              key={brand._id}
                              value={brand._id}
                              className="cursor-pointer rounded-md px-3 py-2 transition hover:bg-blue-100"
                            >
                              {brand.option_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_hsk_skin_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">
                        Dành cho loại da-(filter_hsk_skin_type){" "}
                        <span className="text-sm text-gray-500">(Optional)</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a skin type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {skinType.map((skin) => (
                            <SelectItem key={skin._id} value={skin._id}>
                              {skin.option_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_hsk_uses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">
                        Tác dụng-(filter_hsk_uses) <span className="text-sm text-gray-500">(Optional)</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a uses" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {uses.map((useItem) => (
                            <SelectItem key={useItem._id} value={useItem._id}>
                              {useItem.option_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_hsk_product_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">
                        Loại sản phẩm-(filter_hsk_product_type){" "}
                        <span className="text-sm text-gray-500">(Optional)</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select a product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {productType.map(
                            (
                              productTypeItem // Renamed 'productType' to 'productTypeItem'
                            ) => (
                              <SelectItem key={productTypeItem._id} value={productTypeItem._id}>
                                {productTypeItem.option_name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">
                        Xuất xứ-(filter_origin) <span className="text-sm text-gray-500">(Optional)</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select origin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {origin.map(
                            (
                              originItem // Renamed 'temp' to 'originItem'
                            ) => (
                              <SelectItem key={originItem._id} value={originItem._id}>
                                {originItem.option_name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_hsk_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">
                        Size-(filter_hsk_size) <span className="text-sm text-gray-500">(Optional)</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {size.map((sizeItem) => (
                            <SelectItem key={sizeItem._id} value={sizeItem._id}>
                              {sizeItem.option_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="filter_dac_tinh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">
                        Đặc tính-(filter_dac_tinh) <span className="text-sm text-gray-500">(Optional)</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select characteristic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {dactinh.map((dactinhItem) => (
                            <SelectItem key={dactinhItem._id} value={dactinhItem._id}>
                              {dactinhItem.option_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ingredient Filter */}
                <FormField
                  control={form.control}
                  name="filter_hsk_ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-blue-700">
                        Thành phần-(filter_hsk_ingredients) <span className="text-sm text-gray-500">(Optional)</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-blue-400 shadow-md transition duration-200 hover:border-blue-600 focus:ring-2 focus:ring-blue-600">
                            <SelectValue placeholder="Select ingredient" /> {/* Changed placeholder for clarity */}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60 overflow-y-auto rounded-lg border border-blue-300 bg-white shadow-lg">
                          {ingredient.map(
                            (
                              ingredientItem // Renamed 'temp' to 'ingredientItem'
                            ) => (
                              <SelectItem key={ingredientItem._id} value={ingredientItem._id}>
                                {ingredientItem.option_name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? "Đang xử lý..." : "Thêm sản phẩm"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
