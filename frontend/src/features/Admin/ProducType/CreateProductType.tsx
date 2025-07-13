// src/features/Admin/ProductType/CreateProductType.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Component UI dùng chung
import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// HTTP client của bạn (ví dụ: Axios instance)
import httpClient from "@/lib/axios";
// Import schema và kiểu dữ liệu từ tệp riêng mà chúng ta đã tạo ở Bước 1
import { type CreateProductTypeFormValue, createProductTypeSchema } from "@/lib/productTypeSchema";

const CreateProductType: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Trạng thái đang gửi form
  const navigate = useNavigate(); // Hook điều hướng của React Router Dom

  // Khởi tạo form với React Hook Form và Zod resolver
  const form = useForm<CreateProductTypeFormValue>({
    resolver: zodResolver(createProductTypeSchema), // Áp dụng schema để validate form
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE", // Giá trị mặc định cho trạng thái
    },
  });

  // Xử lý khi submit form
  const onSubmit = async (values: CreateProductTypeFormValue) => {
    setIsSubmitting(true); // Đặt trạng thái đang gửi
    const payload = {
      ...values,
    };
    console.log("FINAL PRODUCT TYPE PAYLOAD TO SERVER:", payload); // Log payload gửi đi

    try {
      // Gửi yêu cầu POST tới API để tạo Loại sản phẩm mới
      // GIẢ ĐỊNH ENDPOINT API CỦA BẠN LÀ "/admin/manage-filters/create-new-filter-hsk-product-type"
      const response = await httpClient.post("/admin/manage-filters/create-new-filter-hsk-product-type", payload);

      if (response.status === 200 || response.status === 201) {
        // Xử lý thành công
        toast.success("Thành công!", {
          description: "Loại sản phẩm mới đã được thêm vào hệ thống.",
        });
        form.reset(); // Reset form sau khi tạo thành công
        navigate("/admin/product-type"); // Điều hướng về trang danh sách Loại sản phẩm
      }
    } catch (error: unknown) {
      // Xử lý lỗi
      let errorMessage = "Có lỗi không xác định xảy ra.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data as {
          message?: string;
          errors?: Record<string, { msg: string }>;
        };
        if (responseData?.errors) {
          const validationErrors = Object.values(responseData.errors)
            .map((err) => err.msg)
            .join(", ");
          errorMessage = `Lỗi xác thực: ${validationErrors}`;
        } else {
          errorMessage = responseData?.message || errorMessage;
        }
      }
      console.error("Error creating brand:", (error as AxiosError)?.response?.data);
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mt-3 ml-10">
        <Button
          className="hover:bg-transparent hover:text-green-600"
          variant="ghost"
          onClick={() => {
            navigate("/admin/product-type"); // Nút quay lại
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Tạo Loại sản phẩm mới</CardTitle>
                <Typography>Cung cấp các thông tin chi tiết cho Loại sản phẩm mới.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Trường Tên Loại sản phẩm */}
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Loại sản phẩm</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên Loại sản phẩm (ví dụ: Son môi, Kem chống nắng)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Trường Mô tả */}
                    {/* Trường Tên danh mục */}
                    <FormField
                      control={form.control}
                      name="category_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên danh mục (ví dụ: Chăm sóc da, Trang điểm)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Trường Tham số danh mục */}
                    <FormField
                      control={form.control}
                      name="category_param"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tham số danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tham số danh mục (ví dụ: son-moi, kem-chong-nang)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Trường Trạng thái */}
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Nút submit */}
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? "Đang tạo..." : "Tạo Loại sản phẩm"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProductType;
