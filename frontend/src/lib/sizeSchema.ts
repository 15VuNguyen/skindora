// src/lib/sizeSchema.ts
import { z } from "zod";

export const createSizeSchema = z.object({
  option_name: z.string().min(1, "Tên kích thước không được để trống."),
  category_name: z.string().min(1, "Tên danh mục không được để trống."),
  category_param: z.string().min(1, "Tham số danh mục không được để trống."),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ." }),
  }),
});

/**
 * Infers the TypeScript type from the createSizeSchema.
 * This type will be used for form values.
 */
export type CreateSizeFormValue = z.infer<typeof createSizeSchema>;
