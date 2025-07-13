export interface ProductFE {
  _id: string;
  quantity: string | number;
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
  filter_brand: string;
  filter_hsk_ingredients: string;
  filter_hsk_skin_type: string;
  filter_hsk_uses: string;
  filter_hsk_product_type: string;
  filter_origin: string;
  filter_dac_tinh: string;
  filter_hsk_size: string;
}
