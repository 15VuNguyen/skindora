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

export interface PaginatedProductsResponse {
  data: ProductSummary[];
  pagination: {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  }
}