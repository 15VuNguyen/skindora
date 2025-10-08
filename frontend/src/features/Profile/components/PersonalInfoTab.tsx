import { CheckCircle, Loader2, Phone, XCircle } from "lucide-react";
import React from "react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ProfileUpdateFormData } from "@/schemas/authSchemas";
import type { User } from "@/types/Auth";

interface PersonalInfoTabProps {
  form: UseFormReturn<ProfileUpdateFormData>;
  isEditing: boolean;
  currentUser: User;
  onSubmitHandler: (data: ProfileUpdateFormData) => Promise<void>;
  isDirty?: boolean;
  isSubmitting?: boolean;
}

export const PersonalInfoTab = React.memo(
  ({ form, isEditing, currentUser, onSubmitHandler, isDirty, isSubmitting }: PersonalInfoTabProps) => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)} noValidate>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel>Họ</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing || form.formState.isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing || form.formState.isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel>Tên người dùng</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing || form.formState.isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-2 space-y-1.5">
                  <Label htmlFor="email_display">Email</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="email_display"
                      type="email"
                      value={currentUser.email}
                      disabled
                      readOnly
                      className="border-dashed bg-gray-200"
                    />
                    {currentUser.isVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="09..."
                            disabled={!isEditing || form.formState.isSubmitting}
                            className="pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing || form.formState.isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 sm:col-span-2">
                      <FormLabel>Liên kết ảnh đại diện</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://example.com/avatar.png"
                          disabled={!isEditing || form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {isEditing && (
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting || !isDirty}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    );
  }
);
