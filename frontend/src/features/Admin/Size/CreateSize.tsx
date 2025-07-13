// src/features/Admin/components/CreateSize.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import httpClient from "@/lib/axios";
import { type CreateSizeFormValue, createSizeSchema } from "@/lib/sizeSchema";

const CreateSize: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<CreateSizeFormValue>({
    resolver: zodResolver(createSizeSchema),
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE",
    },
  });

  const onSubmit = async (values: CreateSizeFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL SIZE PAYLOAD TO SERVER:", payload);

    try {
      const response = await httpClient.post("/admin/manage-filters/create-new-filter-hsk-size", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Thành công!", {
          description: "Kích thước mới đã được thêm vào hệ thống.",
        });
        form.reset();
        navigate("/admin/size");
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
      console.error("Error creating size:", (error as AxiosError)?.response?.data);
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
                <CardTitle>Tạo kích thước mới</CardTitle>
                <Typography>Cung cấp các thông tin chi tiết cho kích thước mới.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Size Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Form field for Size Name */}
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên kích thước</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên kích thước:" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Form field for Category Name */}
                    <FormField
                      control={form.control}
                      name="category_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên danh mục</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên danh mục:" {...field} value={field.value || ""} />
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
                            <Input placeholder="Nhập tham số danh mục:" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Form field for State (ACTIVE/INACTIVE) */}
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
            {/* Submit button */}
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? "Đang tạo..." : "Tạo kích thước"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateSize;
