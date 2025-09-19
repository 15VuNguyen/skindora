export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  publishedAt: string;
  authorId: string;
  filter_brand: string[];
  filter_dac_tinh: string[];
  filter_hsk_ingredients: string[];
  filter_hsk_product_type: string[];
  filter_hsk_size: string[];
  filter_hsk_skin_type: string[];
  filter_hsk_uses: [];
  filter_origin: [];
  created_at: string;
  updated_at: string;
}
