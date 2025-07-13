
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string | string[];
  category: string;
  description?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  onSale?: boolean;
  salePrice?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterOption {
  option_name: string;
  option_id: string;
  category_name: string;
  category_param: string;
}

export interface ProductFilters {
  filter_brand?: FilterOption[];
  filter_origin?: FilterOption[];
  filter_hsk_ingredient?: FilterOption[];
  filter_hsk_skin_type?: FilterOption[];
  filter_hsk_uses?: FilterOption[];
  filter_hsk_product_type?: FilterOption[];
  filter_hsk_size?: FilterOption[];
  filter_dac_tinh?: FilterOption[];
}
