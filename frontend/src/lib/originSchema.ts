// src/lib/originSchema.ts
import { z } from "zod";

// Ensure this matches your Origin interface
export const createOriginSchema = z.object({
  option_name: z.string().min(1, "Tên Xuất xứ không được để trống."),
  category_name: z.string().min(1, "Tên danh mục không được để trống."),
  category_param: z.string().min(1, "Tham số danh mục không được để trống."),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ." }),
  }),
});

export type CreateOriginFormValue = z.infer<typeof createOriginSchema>;
