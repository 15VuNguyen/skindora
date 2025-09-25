export interface Author {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  phone_number: string;
  location: string;
  roleid: number;
  verify: number;
  created_at: string;
  updated_at: string;
}

export interface FilterOption {
  _id: string;
  option_name: string;
  category_name: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: {
    rawHtml: string;
    plainText: string;
  };
  status: string;
  publishedAt: string | null;
  author?: Author;
  filter_brand: FilterOption[];
  filter_dac_tinh: FilterOption[];
  filter_hsk_ingredients: FilterOption[];
  filter_hsk_product_type: FilterOption[];
  filter_hsk_size: FilterOption[];
  filter_hsk_skin_type: FilterOption[];
  filter_hsk_uses: FilterOption[];
  filter_origin: FilterOption[];
  created_at: string;
  updated_at: string;
  image_on_list: string[];
}

export interface PostUser {
  _id: string;
  title: string;
  slug: string;
  content: {
    rawHtml: string;
    plainText: string;
  };
  status: string;
  publishedAt: string | null;
  filter_brand: FilterOption[];
  filter_dac_tinh: FilterOption[];
  filter_hsk_ingredients: FilterOption[];
  filter_hsk_product_type: FilterOption[];
  filter_hsk_size: FilterOption[];
  filter_hsk_skin_type: FilterOption[];
  filter_hsk_uses: FilterOption[];
  filter_origin: FilterOption[];
  created_at: string;
  updated_at: string;
  image_on_list: string[];
  views: string;
}
