export interface ProductSummary {
  _id: string;
  name_on_list: string;
  price_on_list: string;
  image_on_list: string;
}

export interface ProductDetail extends ProductSummary {
  description_detail: {
    plainText: string;
    rawHtml: string;
  };
  ingredients_detail: {
    plainText: string;
    rawHtml: string;
  };
  main_images_detail: string[];
  quantity: number;
}


export interface Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
  
  _id: string;
  name_on_list: string;
  engName_on_list: string;
  price_on_list: string;
  image_on_list: string;
  hover_image_on_list: string;
  product_detail_url: string;
  productName_detail: string;
  engName_detail: string;
  description_detail: {
    rawHtml: string;
    plainText: string;
  };
  ingredients_detail: {
    rawHtml: string;
    plainText: string;
  };
  guide_detail: {
    rawHtml: string;
    plainText: string;
  };
  specification_detail: {
    rawHtml: string;
    plainText: string;
  };
  main_images_detail: string[];
  sub_images_detail: string[];
  filter_hsk_ingredient: string;
  filter_hsk_skin_type: string;
  filter_hsk_uses: string;
  filter_hsk_product_type: string;
  filter_origin: string;
  filter_brand: string;
  filter_dac_tinh: string;
  filter_hsk_size: string;
  quantity: number;
}



export interface PaginatedProductsResponse {
  data: Product[];
  pagination: {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
}
