// src/features/Admin/components/UpdateSize.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
// Added Loader2 for loading state
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
import { useFetchSizeByID } from "@/hooks/Size/useFetchSizeByID";
import httpClient from "@/lib/axios";
import { type CreateSizeFormValue, createSizeSchema } from "@/lib/sizeSchema";

const UpdateSize: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the size ID from the URL
  const navigate = useNavigate();

  const { loading: isLoadingInitialData, data: sizeData, fetchSizeByID } = useFetchSizeByID(id || "");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<CreateSizeFormValue>({
    resolver: zodResolver(createSizeSchema),
    defaultValues: {
      option_name: "",

      category_name: "",
      category_param: "",
      state: "ACTIVE",
    },
  });

  useEffect(() => {
    if (id) {
      fetchSizeByID();
    }
  }, [id, fetchSizeByID]);

  useEffect(() => {
    if (sizeData) {
      form.reset({
        option_name: sizeData.option_name,
        category_name: sizeData.category_name,
        category_param: sizeData.category_param,
        state: sizeData.state as "ACTIVE" | "INACTIVE",
      });
    }
  }, [sizeData, form]);

  const onSubmit = async (values: CreateSizeFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL SIZE UPDATE PAYLOAD TO SERVER:", payload);

    try {
      const response = await httpClient.put(`/admin/manage-filters/update-filter-hsk-size/${id}`, payload);

      if (response.status === 200) {
        toast.success("Thành công!", {
          description: "Kích thước đã được cập nhật thành công.",
        });
        navigate("/admin/size");
      }
    } catch (error: unknown) {
      let errorMessage = "Có lỗi không xác định xảy ra khi cập nhật kích thước.";
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
      console.error("Error updating size:", (error as AxiosError)?.response?.data);
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingInitialData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu kích thước...</span>
        </div>
      </div>
    );
  }

  if (!id || !sizeData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Typography variant="h4" className="text-red-500">
          Không tìm thấy kích thước hoặc ID không hợp lệ.
        </Typography>
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
            navigate("/admin/size");
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
                <CardTitle>Cập nhật kích thước</CardTitle>
                <Typography>Chỉnh sửa thông tin chi tiết cho kích thước này.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Size Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên kích thước</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên kích thước (ví dụ: S, M, L, 36, 38)"
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
                              placeholder="Nhập tên danh mục (ví dụ: Quần áo, Giày)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Form field for Category Parameter */}
                    <FormField
                      control={form.control}
                      name="category_param"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tham số danh mục</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tham số danh mục (ví dụ: quan-ao, giay)"
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger disabled>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
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
            {/* Submit button */}
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật kích thước"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateSize;
