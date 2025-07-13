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
import { useFetchUsesByID } from "@/hooks/Uses/useFetchUsesByID";
import httpClient from "@/lib/axios";
import type { CreateUsesFormValue } from "@/lib/usesSchema";
import { createUsesSchema } from "@/lib/usesSchema";
import type { Uses } from "@/types/Filter/uses";

const UpdateUses: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data: fetchedUsesData, fetchUsesByID, loading } = useFetchUsesByID(String(id));

  const form = useForm<CreateUsesFormValue>({
    resolver: zodResolver(createUsesSchema),
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE",
    },
  });

  useEffect(() => {
    if (id) {
      fetchUsesByID();
    }
  }, [id, fetchUsesByID]);
  useEffect(() => {
    // Bất cứ khi nào có lỗi trong form, nó sẽ được log ra ở đây
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("CÁC LỖI HIỆN TẠI CỦA FORM:", form.formState.errors);
    }
  }, [form.formState.errors]);
  useEffect(() => {
    console.log(fetchedUsesData);
  }, [fetchedUsesData]);

  useEffect(() => {
    if (fetchedUsesData) {
      const usesToEdit = fetchedUsesData as Uses;
      form.reset({
        option_name: usesToEdit.option_name,
        category_name: usesToEdit.category_name,
        category_param: usesToEdit.category_param,
        state: usesToEdit.state as "ACTIVE" | "INACTIVE",
      });
    }
  }, [fetchedUsesData, form]);

  const onSubmit = async (values: CreateUsesFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL USES UPDATE PAYLOAD TO SERVER:", payload);

    try {
      // Adjust the API endpoint for updating a uses
      const response = await httpClient.put(`/admin/manage-filters/update-filter-hsk-uses/${id}`, payload);

      console.log(response);
      if (response.status === 200) {
        toast.success("Thành công!", {
          description: "Thông tin Công dụng đã được cập nhật.",
        });

        navigate("/admin/uses");
      }
      if (response.status === 400) {
        toast.success("Đã bị disabled", {
          description: "Do đó không cập nhật được",
        });

        navigate("/admin/uses");
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
      console.error("Error updating uses:", (error as AxiosError)?.response?.data); // Error log for Uses
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      console.log("Submit finished, isSubmitting set to false.");
      setIsSubmitting(false);
    }
  };

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

  if (!fetchedUsesData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu...</span>
        </div>
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
            navigate("/admin/uses"); // Navigate back to Uses list
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
                <CardTitle>Cập nhật Công dụng</CardTitle> {/* Title for Uses */}
                <Typography>Chỉnh sửa các thông tin chi tiết cho Công dụng.</Typography> {/* Description for Uses */}
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Uses Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Công dụng</FormLabel> {/* Label for Uses name */}
                          <FormControl>
                            <Input
                              placeholder="Nhập tên Công dụng (ví dụ: Chống lão hóa, Dưỡng ẩm)" // Placeholder for Uses name
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
                              placeholder="Nhập tên danh mục (ví dụ: Chăm sóc da, Chăm sóc tóc)" // Placeholder for category
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
                              placeholder="Nhập tham số danh mục (ví dụ: chong-lao-hoa, duong-am)"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* FormField for state */}
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
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật Công dụng"} {/* Button text for Uses */}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateUses;
