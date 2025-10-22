import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, CreditCard, LoaderCircle, MapPin, Truck } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { type CheckoutFormData } from "..";

interface CheckoutFormProps {
  form: ReturnType<typeof useForm<CheckoutFormData>>;
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting: boolean;
}

export function CheckoutForm({ form, onSubmit, isSubmitting }: CheckoutFormProps) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Thông tin giao hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-5">
              <Label htmlFor="shipAddress">Địa chỉ giao hàng *</Label>
              <Controller
                name="ShipAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      id="shipAddress"
                      placeholder="Nhập địa chỉ đầy đủ (số nhà, đường, thành phố)"
                      {...field}
                      className="min-h-[80px]"
                    />
                    {fieldState.error && <p className="text-destructive mt-1 text-sm">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-5">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Controller
                name="PhoneNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      id="phoneNumber"
                      placeholder="Nhập số điện thoại (không bắt buộc)"
                      {...field}
                    />
                    {fieldState.error && <p className="text-destructive mt-1 text-sm">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-5">
              <Label htmlFor="description">Ghi chú giao hàng</Label>
              <Controller
                name="Description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="VD: Gọi trước khi giao, gửi cho bảo vệ..."
                    {...field}
                    className="min-h-[60px]"
                  />
                )}
              />
            </div>
            <div className="space-y-5">
              <Label>Ngày giao hàng mong muốn</Label>
              <Controller
                name="RequireDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP", { locale: vi }) : "Chọn ngày giao hàng"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.error && <p className="text-destructive mt-1 text-sm">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Phương thức thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="PaymentMethod"
              control={form.control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                  <Label
                    htmlFor="cod"
                    className="has-[:checked]:bg-primary/10 has-[:checked]:border-primary flex cursor-pointer items-center space-x-3 rounded-lg border p-4"
                  >
                    <RadioGroupItem value="COD" id="cod" />
                    <div className="flex flex-1 items-center gap-3">
                      <Truck className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-sm text-gray-500">Thanh toán tiền mặt khi nhận hàng</p>
                      </div>
                    </div>
                  </Label>
                  <Label
                    htmlFor="zalopay"
                    className="has-[:checked]:bg-primary/10 has-[:checked]:border-primary flex cursor-pointer items-center space-x-3 rounded-lg border p-4"
                  >
                    <RadioGroupItem value="ZALOPAY" id="zalopay" />
                    <div className="flex flex-1 items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                        <path
                          fill="#2962ff"
                          d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10  c4.722,0,8.883-2.348,11.417-5.931V36H15z"
                        ></path>
                        <path
                          fill="#eee"
                          d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19  c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742  c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083  C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"
                        ></path>
                        <path
                          fill="#2962ff"
                          d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75 S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"
                        ></path>
                        <path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"></path>
                        <path
                          fill="#2962ff"
                          d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75  S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5 c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"
                        ></path>
                        <path
                          fill="#2962ff"
                          d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5  c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"
                        ></path>
                      </svg>
                      <div>
                        <p className="font-medium">ZaloPay</p>
                        <p className="text-sm text-gray-500">Thanh toán bằng ví ZaloPay</p>
                      </div>
                    </div>
                  </Label>
                  <Label
                    htmlFor="vnpay"
                    className="has-[:checked]:bg-primary/10 has-[:checked]:border-primary flex cursor-pointer items-center space-x-3 rounded-lg border p-4"
                  >
                    <RadioGroupItem value="VNPAY" id="vnpay" />
                    <div className="flex flex-1 items-center gap-3">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 403.2 280.8"
                        className="h-6"
                        aria-label="VNPay"
                      >
                        <style>{".st0{fill:#FCAF17;}.st1{fill:#20409A;}.st2{fill:#00BAF2;}"}</style>
                        <g>
                          <path
                            className="st2"
                            d="M27.9,24.1C42.4,9.4,62.7,1,83.2,0.4c21.9-0.7,44.1,7.7,59.8,23.2c16.2,16.2,32.4,32.3,48.5,48.5
                        c3.3,3.4,6.9,6.6,9.9,10.2c-27.4,27.3-54.8,54.8-82.2,82.1c-11.4,11.3-22.5,22.8-34.1,33.8c-16-16-32-32-48-48
                        c-6.3-6.4-13.1-12.6-18.3-19.9C6.3,112.9,1.1,90.4,4.6,69.2C7.3,52.2,15.5,36.1,27.9,24.1z"
                          />
                          <path
                            className="st0"
                            d="M302.2,1.8c20-3.9,41.4,0.2,58.8,10.8c16.1,10,28.6,25.7,34.5,43.7c7,21,5.2,44.7-5.1,64.3
                        c-4,7.6-9.2,14.6-15.4,20.6c-19,18.9-37.9,37.9-56.9,56.9c-0.9-0.9-1.9-1.7-2.8-2.5c-38-37.7-75.7-75.7-113.6-113.5
                        c19.5-19.6,39.1-39.1,58.6-58.6C271.7,12.3,286.5,4.7,302.2,1.8z"
                          />
                          <path
                            className="st1"
                            d="M201.4,82.3l0.2-0.2c37.9,37.8,75.6,75.8,113.6,113.5c0.9,0.9,1.8,1.7,2.7,2.6c-15.1,15.2-30.3,30.3-45.4,45.5
                        c-5.7,5.6-11.2,11.5-17.2,16.7c-12.5,11-28.5,17.9-45,19.6c-17.7,1.9-36-2-51.2-11.4c-7.9-4.6-14.6-10.9-20.9-17.4
                        c-17.7-17.7-35.3-35.3-53-53c11.6-11.1,22.7-22.6,34.1-33.8C146.7,137.1,174,109.6,201.4,82.3z"
                          />
                        </g>
                      </svg>
                      <div>
                        <p className="font-medium">VNPay</p>
                        <p className="text-sm text-gray-500">Thanh toán qua ứng dụng ngân hàng bằng mã QR VNPay</p>
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              )}
            />
          </CardContent>
        </Card>
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Đang đặt hàng..." : "Đặt hàng"}
        </Button>
      </form>
    </FormProvider>
  );
}
