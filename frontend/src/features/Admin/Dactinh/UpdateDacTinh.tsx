import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

// Import z for schema definition

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchFilterDacTinhByID } from "@/hooks/Dactinh/useFetchFilterDacTinhByID";
import httpClient from "@/lib/axios";

export interface DacTinh {
  _id: string;
  option_name: string;
  category_name: string;
  category_param: string;
  state: string;
  created_at: string;
  updated_at: string;
}

// Define the Zod schema for form validation
const updateDacTinhSchema = z.object({
  option_name: z.string().min(1, "Tên đặc tính không được để trống."),
  category_name: z.string().min(1, "Tên danh mục không được để trống."),
  category_param: z.string().min(1, "Tham số danh mục không được để trống."),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ." }),
  }),
});

type UpdateDacTinhFormValue = z.infer<typeof updateDacTinhSchema>;

const UpdateDacTinh: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const { data: fetchedDacTinhData, loading, fetchFilterDacTinhByID } = useFetchFilterDacTinhByID(String(id));

  const form = useForm<UpdateDacTinhFormValue>({
    resolver: zodResolver(updateDacTinhSchema),
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE",
    },
  });

  useEffect(() => {
    if (id) {
      fetchFilterDacTinhByID();
    }
  }, [id, fetchFilterDacTinhByID]);

  useEffect(() => {
    if (fetchedDacTinhData) {
      form.reset({
        option_name: fetchedDacTinhData.option_name,
        category_name: fetchedDacTinhData.category_name,
        category_param: fetchedDacTinhData.category_param,
        state: fetchedDacTinhData.state as "ACTIVE" | "INACTIVE",
      });
    }
  }, [fetchedDacTinhData, form]);

  const onSubmit = async (values: UpdateDacTinhFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL DAC TINH UPDATE PAYLOAD TO SERVER:", payload);

    try {
      const response = await httpClient.put(`/admin/manage-filters/update-filter-dac-tinh/${id}`, payload);
      console.log(response);
      if (response.status === 200) {
        toast.success("Thành công!", {
          description: "Thông tin đặc tính đã được cập nhật.",
        });

        navigate("/admin/dac-tinh");
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
      console.error("Error updating dac tinh:", (error as AxiosError)?.response?.data);
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

  if (!fetchedDacTinhData && !loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold">Đặc tính không tìm thấy</h2>
        <p className="mt-2 text-gray-500">Đặc tính với ID &quot;{id}&quot; không tồn tại hoặc không thể tải.</p>
        <Button onClick={() => navigate("/admin/dac-tinh")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách đặc tính
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
            navigate("/admin/dac-tinh");
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
                <CardTitle>Cập nhật Đặc tính</CardTitle>
                <Typography>Chỉnh sửa các thông tin chi tiết cho đặc tính.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Dac Tinh Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên đặc tính</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên đặc tính (ví dụ: Màu sắc, Kích cỡ)"
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
                              placeholder="Nhập tên danh mục (ví dụ: Giày, Quần áo)"
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
                              placeholder="Nhập tham số danh mục (ví dụ: mau-sac, kich-co)"
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
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật đặc tính"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateDacTinh;
