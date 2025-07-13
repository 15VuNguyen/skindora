// src/lib/productTypeSchema.ts
import { z } from "zod";

export const createProductTypeSchema = z.object({
  option_name: z.string().min(1, "Tên Loại sản phẩm không được để trống."),
  category_name: z.string().min(1, "Tên danh mục không được để trống."),
  category_param: z.string().min(1, "Tham số danh mục không được để trống."),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ." }),
  }),
});

export type CreateProductTypeFormValue = z.infer<typeof createProductTypeSchema>;
export type UpdateProductTypeFormValue = z.infer<typeof createProductTypeSchema>;
