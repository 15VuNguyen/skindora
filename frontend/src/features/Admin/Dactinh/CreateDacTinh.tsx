import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

// Import zod for schema definition

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import httpClient from "@/lib/axios";

const createDacTinhSchema = z.object({
  option_name: z.string().min(1, "Tên đặc tính không được để trống."),
  category_name: z.string().min(1, "Tên danh mục không được để trống."),
  category_param: z.string().min(1, "Tham số danh mục không được để trống."),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    required_error: "Trạng thái là bắt buộc.",
  }),
});

type CreateDacTinhFormValue = z.infer<typeof createDacTinhSchema>;

const CreateDacTinh: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<CreateDacTinhFormValue>({
    resolver: zodResolver(createDacTinhSchema),
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE", // Default state is ACTIVE
    },
  });

  // Handle form submission
  const onSubmit = async (values: CreateDacTinhFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL DAC TINH PAYLOAD TO SERVER:", payload);

    try {
      // Adjust the API endpoint for creating a new DacTinh
      const response = await httpClient.post("/admin/manage-filters/create-new-filter-dac-tinh", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Thành công!", {
          description: "Đặc tính mới đã được thêm vào hệ thống.",
        });
        form.reset(); // Reset form after successful submission
        // navigate("/admin/dac-tinh");
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
      console.error("Error creating DacTinh:", (error as AxiosError)?.response?.data);
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Back button */}
      <div className="mt-3 ml-10">
        <Button
          className="hover:bg-transparent hover:text-green-600"
          variant="ghost"
          onClick={() => {
            navigate("/admin/dac-tinh"); // Navigate back to DacTinh list
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>

      {/* Form container */}
      <div className="container mx-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Tạo đặc tính mới</CardTitle>
                <Typography>Cung cấp các thông tin chi tiết cho đặc tính mới.</Typography>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Basic Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* option_name field */}
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên đặc tính</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên đặc tính " {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* category_name field */}
                    <FormField
                      control={form.control}
                      name="category_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên danh mục</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên danh mục" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* category_param field */}
                    <FormField
                      control={form.control}
                      name="category_param"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá trị đặc tính</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập giá trị đặc tính " {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* state field */}
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
              {isSubmitting ? "Đang tạo..." : "Tạo đặc tính"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateDacTinh;
