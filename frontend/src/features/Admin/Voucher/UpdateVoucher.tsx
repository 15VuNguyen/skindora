import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchVoucherByID } from "@/hooks/Voucher/useFetchVoucherById";
import { type VoucherUpdate, useUpdateVoucher } from "@/hooks/Voucher/useUpdateVoucher";
import { voucherSchema } from "@/lib/voucherSchema";
import type { VoucherFormValue } from "@/lib/voucherSchema";

const AddVoucherPage: React.FC = () => {
  const { voucherId } = useParams();
  const { fetchAllVoucherByID, loading, voucher } = useFetchVoucherByID(String(voucherId));
  const { updateVoucherByID, status } = useUpdateVoucher(String(voucherId));
  useEffect(() => {
    fetchAllVoucherByID();
  }, []);
  useEffect(() => {}, [status]);
  useEffect(() => {
    console.log(voucher);
  }, [voucher]);
  console.log(voucherId);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const form = useForm<VoucherFormValue>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: voucher?.code,
      description: voucher?.description,
      discountType: voucher?.discountType,
      discountValue: voucher?.discountValue,
      maxDiscountAmount: voucher?.maxDiscountAmount,
      minOrderValue: voucher?.minOrderValue,
      startDate: voucher?.startDate,
      endDate: voucher?.endDate,
      usageLimit: voucher?.usageLimit,
      userUsageLimit: voucher?.userUsageLimit,
    },
  });
  useEffect(() => {
    if (voucher) {
      console.log("Voucher data fetched:", voucher);
      form.reset({
        code: voucher.code || "",
        description: voucher.description || "",
        discountType: voucher.discountType || "PERCENTAGE",
        discountValue: voucher.discountValue,
        maxDiscountAmount: voucher.maxDiscountAmount,
        minOrderValue: voucher.minOrderValue,
        startDate: voucher.startDate ? new Date(voucher.startDate).toISOString().split("T")[0] : "",
        endDate: voucher.endDate ? new Date(voucher.endDate).toISOString().split("T")[0] : "",
        usageLimit: String(voucher.usageLimit),
        userUsageLimit: String(voucher.userUsageLimit),
      });
    }
  }, [voucher, form.reset]);
  useEffect(() => {
    if (!loading && status !== undefined) {
      if (status >= 200 && status < 300) {
        toast.success("Thành công", {
          description: "Voucher đã được cập nhật thành công!",
        });
        form.reset();
      } else {
        toast.error("Thất bại", {
          description: `Có lỗi xảy ra khi cập nhật voucher. Mã lỗi: ${status}`,
        });
      }
    }
  }, [status, loading, form]);
  const onSubmit = async (values: VoucherFormValue) => {
    setIsSubmitting(true);
    const payload: VoucherUpdate = {
      ...values,
    };
    console.log("FINAL PAYLOAD TO SERVER:", payload);
    try {
      await updateVoucherByID(payload);
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
          errorMessage = `Validation errors: ${validationErrors}`;
        } else {
          errorMessage = responseData?.message || errorMessage;
        }
      }
      console.log((error as AxiosError)?.response?.data);
      toast.error("Thất bại!", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-muted-foreground flex items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-lg">Đang tải dữ liệu...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="mt-3 ml-10">
            <Button
              className="hover:bg-transparent hover:text-green-600"
              variant="ghost"
              onClick={() => {
                navigate("/admin/voucher");
              }}
            >
              <ArrowLeft />
              Quay lại
            </Button>
          </div>
          <div className="container mx-auto p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin voucher</CardTitle>
                    <Typography>Cung cấp các thông tin chi tiết cho sản phẩm của bạn.</Typography>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <h3 className="mb-4 text-lg font-medium">Voucher</h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Code</FormLabel>
                              <FormControl>
                                <Input {...field} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mô tả</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="discountValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá trị giảm giá</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="discountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại giảm giá</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại giảm giá" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PERCENTAGE">Giảm theo phần trăm</SelectItem>
                                  <SelectItem value="FIXED">Giảm giá cố định</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="minOrderValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giá trị đơn hàng tối thiểu</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="maxDiscountAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số tiền giảm tối đa</FormLabel>
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
                      <h3 className="mb-4 text-lg font-medium">Thông tin kinh doanh</h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày bắt đầu</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày kết thúc</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
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
                          name="usageLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tổng số lượt sử dụng</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="userUsageLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Giới hạn sử dụng cho mỗi người dùng</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
                  {isSubmitting ? "Đang xử lý..." : "Chỉnh sửa"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddVoucherPage;
