import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Ensure z is imported

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import httpClient from "@/lib/axios";
import { type CreateSkinTypeFormValue, createSkinTypeSchema } from "@/lib/skinTypeSchema";

const CreateSkinType: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<CreateSkinTypeFormValue>({
    resolver: zodResolver(createSkinTypeSchema), // Use the new SkinType schema
    defaultValues: {
      option_name: "",
      category_name: "",
      category_param: "",
      state: "ACTIVE",
    },
  });

  const onSubmit = async (values: CreateSkinTypeFormValue) => {
    setIsSubmitting(true);
    const payload = {
      ...values,
    };
    console.log("FINAL SKIN TYPE PAYLOAD TO SERVER:", payload); // Log for Skin Type

    try {
      // Adjust the API endpoint for creating a new skin type
      const response = await httpClient.post("/admin/manage-filters/create-new-filter-hsk-skin-type", payload); // ASSUMED API ENDPOINT

      if (response.status === 200 || response.status === 201) {
        toast.success("Thành công!", {
          description: "Loại da mới đã được thêm vào hệ thống.",
        });
        form.reset();
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
      console.error("Error creating skin type:", (error as AxiosError)?.response?.data); // Error log for Skin Type
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
            navigate("/admin/skin-type"); // Navigate back to skin type list
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
                <CardTitle>Tạo Loại da mới</CardTitle> {/* Title for Skin Type */}
                <Typography>Cung cấp các thông tin chi tiết cho Loại da mới.</Typography>{" "}
                {/* Description for Skin Type */}
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Skin Type Information Section */}
                <div className="md:col-span-2">
                  <h3 className="mb-4 text-lg font-medium">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="option_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên Loại da</FormLabel> {/* Label for Skin Type name */}
                          <FormControl>
                            <Input
                              placeholder="Nhập tên Loại da (ví dụ: Da dầu, Da khô)" // Placeholder for Skin Type name
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
                              placeholder="Nhập tên danh mục (ví dụ: Loại da)" // Placeholder for category
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
                              placeholder="Nhập tham số danh mục (ví dụ: da-dau, da-kho)" // Placeholder for category param
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
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
              {isSubmitting ? "Đang tạo..." : "Tạo Loại da"} {/* Button text for Skin Type */}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateSkinType;
