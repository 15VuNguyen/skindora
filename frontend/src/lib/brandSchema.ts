import { z } from "zod";

export const createBrandSchema = z.object({
  option_name: z.string(),
  category_name: z.string(),
  category_param: z.string(),
  state: z.enum(["ACTIVE", "INACTIVE"], {
    required_error: "Vui lòng chọn trạng thái cho thương hiệu.",
  }),
});

export type CreateBrandFormValue = z.infer<typeof createBrandSchema>;
