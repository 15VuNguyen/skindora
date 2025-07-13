// src/lib/ingredientSchema.ts
import { z } from "zod";

// Ensure this matches your Ingredient interface
export const createIngredientSchema = z.object({
  option_name: z.string().min(1, "Tên Ingredient không được để trống."),
  category_name: z.string().min(1, "Tên danh mục không được để trống."),
  category_param: z.string().min(1, "Tham số danh mục không được để trống."),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ." }),
  }),
});

export type CreateIngredientFormValue = z.infer<typeof createIngredientSchema>;
