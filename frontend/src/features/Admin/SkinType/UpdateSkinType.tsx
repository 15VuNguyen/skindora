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
import { useFetchSkinTypeByID } from "@/hooks/SkinType/useFetchSkinTypeByID";
import httpClient from "@/lib/axios";
import type { CreateSkinTypeFormValue } from "@/lib/skinTypeSchema";
import { createSkinTypeSchema } from "@/lib/skinTypeSchema";
import type { SkinType } from "@/types/Filter/skinType";

const UpdateSkinType: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch SkinType data using the hook
  const { data: fetchedSkinTypeData, fetchSkinTypeByID, loading } = useFetchSkinTypeByID(String(id));

  const form = useForm<CreateSkinTypeFormValue>({
    resolver: zodResolver(createSkinTypeSchema),
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE",
    },
  });

  useEffect(() => {
    if (id) {
      fetchSkinTypeByID();
    }
  }, [id, fetchSkinTypeByID]);
  useEffect(() => {
    console.log(fetchedSkinTypeData);
  }, [fetchedSkinTypeData]);

  useEffect(() => {
    if (fetchedSkinTypeData) {
      const skinTypeToEdit = fetchedSkinTypeData as SkinType;
      form.reset({
        option_name: skinTypeToEdit.option_name,

        category_name: skinTypeToEdit.category_name,
        category_param: skinTypeToEdit.category_param,
        state: skinTypeToEdit.state as "ACTIVE" | "INACTIVE",
      });
    }
  }, [fetchedSkinTypeData, form]);

  const onSubmit = async (values: CreateSkinTypeFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL SKIN TYPE UPDATE PAYLOAD TO SERVER:", payload);

    try {
      const response = await httpClient.put(`/admin/manage-filters/update-filter-hsk-skin-type/${id}`, payload);

      console.log(response);
      if (response.status === 200) {
        toast.success("Thành công!", {
          description: "Thông tin Loại da đã được cập nhật.",
        });

        navigate("/admin/skin-type");
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
      console.error("Error updating skin type:", (error as AxiosError)?.response?.data);
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
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

  if (!fetchedSkinTypeData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Loại da không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Loại da với ID &quot;{id}&quot; không tồn tại hoặc không thể tải.</p>
        <Button onClick={() => navigate("/admin/skin-type")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách Loại da
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
            navigate("/admin/skin-type");
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
                <CardTitle>Cập nhật Loại da</CardTitle>
                <Typography>Chỉnh sửa các thông tin chi tiết cho Loại da.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* SkinType Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Loại da</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên Loại da (ví dụ: Da dầu, Da khô)"
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
                              placeholder="Nhập tên danh mục (ví dụ: Loại da)"
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
                              placeholder="Nhập tham số danh mục (ví dụ: da-dau, da-kho)"
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
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật Loại da"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateSkinType;
