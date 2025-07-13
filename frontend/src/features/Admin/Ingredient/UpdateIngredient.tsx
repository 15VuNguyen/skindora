import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Đảm bảo đường dẫn này đúng với vị trí của hook useFetchIngredientByID
import { useFetchIngredientByID } from "@/hooks/Ingredient/useFetchFilterIngredientByID";
import httpClient from "@/lib/axios";
// Đảm bảo đường dẫn này đúng với vị trí của schema ingredient
import { type CreateIngredientFormValue, createIngredientSchema } from "@/lib/ingredientSchema";

// Type Ingredient có thể cần import nếu dùng cho ép kiểu, nhưng thường hook đã trả về đúng type rồi
// import type { Ingredient } from "@/types/Filter/ingredient";

const UpdateIngredient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch dữ liệu thành phần bằng hook
  const { data: fetchedIngredientData, fetchIngredientByID, loading } = useFetchIngredientByID(id || "");

  const form = useForm<CreateIngredientFormValue>({
    resolver: zodResolver(createIngredientSchema),
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      // KHÔNG nên cố gắng lấy fetchedIngredientData?.state ở đây
      // vì fetchedIngredientData ban đầu là undefined.
      // Dữ liệu sẽ được reset trong useEffect thứ hai.
      state: "ACTIVE", // Đặt mặc định an toàn
    },
  });

  useEffect(() => {
    if (id) {
      fetchIngredientByID();
    }
  }, [id, fetchIngredientByID]); // Thêm 'id' vào dependencies để re-fetch nếu ID thay đổi

  useEffect(() => {
    // console.log(fetchedIngredientData); // Có thể bỏ comment để debug
    // Điền dữ liệu vào form sau khi dữ liệu được fetch
    if (fetchedIngredientData) {
      // Ép kiểu sang `CreateIngredientFormValue['state']` an toàn hơn `as "ACTIVE" | "INACTIVE"`
      const formattedState = fetchedIngredientData.state.toUpperCase() as CreateIngredientFormValue["state"];

      form.reset({
        option_name: fetchedIngredientData.option_name,
        category_name: fetchedIngredientData.category_name,
        category_param: fetchedIngredientData.category_param,
        state: formattedState, // Sử dụng giá trị đã định dạng
      });
    }
  }, [fetchedIngredientData, form]);

  const onSubmit = async (values: CreateIngredientFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
      // Chuyển đổi trạng thái từ form (uppercase) sang lowercase cho backend
      state: values.state.toLowerCase(),
    };
    console.log("FINAL INGREDIENT UPDATE PAYLOAD TO SERVER:", payload);

    try {
      // Correct API endpoint for updating an ingredient
      const response = await httpClient.put(`/admin/manage-filters/update-filter-hsk-ingredient/${id}`, payload);
      console.log(response);
      if (response.status === 200) {
        toast.success("Thành công!", {
          description: "Thông tin thành phần đã được cập nhật.",
        });
        navigate("/admin/ingredient"); // Điều hướng đến danh sách thành phần
      }
    } catch (error: unknown) {
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
      console.error("Lỗi cập nhật thành phần:", (error as AxiosError)?.response?.data);
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Trạng thái Loading ---
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu thành phần...</span>
        </div>
      </div>
    );
  }

  // --- Trạng thái không tìm thấy dữ liệu ---
  if (!fetchedIngredientData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Thành phần không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Thành phần với ID "{id}" không tồn tại hoặc không thể tải.</p>
        <Button onClick={() => navigate("/admin/ingredient")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách thành phần
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-3 ml-10">
        <Button
          className="hover:bg-transparent hover:text-green-600"
          variant="ghost"
          onClick={() => {
            navigate("/admin/ingredient");
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
                <CardTitle>Cập nhật thành phần</CardTitle>
                <Typography>Chỉnh sửa các thông tin chi tiết cho thành phần.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Ingredient Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên thành phần</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên thành phần (ví dụ: Cotton, Polyester)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên danh mục (ví dụ: Vải, Vật liệu)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category_param"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tham số danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tham số danh mục (ví dụ: vai, vat-lieu)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger disabled>
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
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật thành phần"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateIngredient;
