import { z } from "zod";

const detailObjectSchema = z.object({
  rawHtml: z.string().min(50, "Nội dung HTML không được trống").max(1000000, "Nội dung quá dài"),
  plainText: z.string(),
});
export const postSchema = z.object({
  title: z.string().min(1, "Tên bài viết bằng tiếng việt không được để trống"),
  slug: z.string().min(1, "Tên sản phẩm bằng tiếng anh không được để trống"),
  content: detailObjectSchema,
  status: z.enum(["DRAFT", "PUBLISHED"], {
    errorMap: () => ({ message: "Trạng thái không hợp lệ" }),
  }),
  image_on_list: z.array(
    z.object({
      value: z.string().url("URL không hợp lệ").min(1, "URL không được để trống"),
    })
  ),
  filter_brand: z.array(z.string()).optional(),
  filter_hsk_skin_type: z.array(z.string()).optional(),
  filter_hsk_uses: z.array(z.string()).optional(),
  filter_hsk_product_type: z.array(z.string()).optional(),
  filter_origin: z.array(z.string()).optional(),
  filter_hsk_ingredients: z.array(z.string()).optional(),
  filter_hsk_size: z.array(z.string()).optional(),
  filter_dac_tinh: z.array(z.string()).optional(),
});
export type PostFormValues = z.infer<typeof postSchema>;
