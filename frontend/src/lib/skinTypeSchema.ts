// src/lib/skinTypeSchema.ts
import { z } from "zod";

// Ensure this matches your SkinType interface
export const createSkinTypeSchema = z.object({
  option_name: z.string().min(1, "Tên Loại da không được để trống."),
  category_name: z.string().min(1, "Tên danh mục không được để trống."),
  category_param: z.string().min(1, "Tham số danh mục không được để trống."),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ." }),
  }),
});

export type CreateSkinTypeFormValue = z.infer<typeof createSkinTypeSchema>;
