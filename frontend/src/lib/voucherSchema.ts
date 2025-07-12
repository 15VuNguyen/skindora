import z from "zod";

export const voucherSchema = z
  .object({
    code: z.string().min(1, "Code sản phẩm không được để trống"),
    description: z.string().min(1, "Description sản phẩm không được để trống"),
    discountType: z.string().min(1, "DiscountType sản phẩm không được để trống"),
    discountValue: z.string().min(0, "DiscountValue sản phẩm không được để trống"),
    maxDiscountAmount: z.string().min(0, "MaxDiscountAmount sản phẩm không được để trống"),
    minOrderValue: z.string().min(0, "MinOrderValue sản phẩm không được để trống"),
    startDate: z.string().min(1, "StartDate sản phẩm không được để trống"),
    endDate: z.string().min(1, "EndDate sản phẩm không được để trống"),
    usageLimit: z.string().min(0, "UsageLimit sản phẩm không được để trống"),
    userUsageLimit: z.string().min(0, "UserUsageLimit sản phẩm không được để trống"),
  })
  .superRefine((data, ctx) => {
    // data: là toàn bộ object của form
    // ctx: là context để bạn thêm lỗi (issue) vào một trường cụ thể

    // Logic điều kiện của bạn ở đây
    if (data.discountType === "PERCENTAGE" && Number(data.discountValue) >= 100) {
      // Nếu loại là % và giá trị lớn hơn 100
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // Loại lỗi custom
        message: "Giá trị giảm giá theo % không được vượt quá 100",
        path: ["discountValue"], // Lỗi này sẽ hiển thị ở trường `discountValue`
      });
    }
    if (data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, // Loại lỗi custom
        message: "Ngày kết thúc phải sau ngày bắt đầu",
        path: ["endDate"], // Lỗi này sẽ hiển thị ở trường `discountValue`
      });
    }
  });
export type VoucherFormValue = z.infer<typeof voucherSchema>;
