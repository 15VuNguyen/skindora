// src/lib/usesSchema.ts
import { z } from "zod";

// Đảm bảo interface Uses của bạn khớp với schema này
export const createUsesSchema = z.object({
  option_name: z.string().min(1, "Tên Công dụng không được để trống."),
  category_name: z.string().min(1, "Tên danh mục không được để trống."),
  category_param: z.string().min(1, "Tham số danh mục không được để trống."),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ." }),
  }),
});

export type CreateUsesFormValue = z.infer<typeof createUsesSchema>;
export type UpdateUsesFormValue = z.infer<typeof createUsesSchema>;
