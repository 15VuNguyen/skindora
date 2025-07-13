import { ObjectId } from 'mongodb'
import { ProductState } from '~/constants/enums'

export interface CreateNewProductReqBody {
  name_on_list: string
  engName_on_list: string
  price_on_list: string
  image_on_list: string
  hover_image_on_list: string
  productName_detail: string
  engName_detail: string
  description_detail: Object
  ingredients_detail: Object
  guide_detail: Object
  specification_detail: Object
  main_images_detail: string[]
  sub_images_detail: string[]
  filter_brand?: ObjectId
  filter_dac_tinh?: ObjectId
  filter_hsk_ingredients?: ObjectId
  filter_hsk_product_type?: ObjectId
  filter_hsk_size?: ObjectId
  filter_hsk_skin_type?: ObjectId
  filter_hsk_uses?: ObjectId
  filter_origin?: ObjectId
  quantity: number
  state?: ProductState
}

export interface updateProductReqBody {
  name_on_list: string
  engName_on_list: string
  price_on_list: string
  image_on_list: string
  hover_image_on_list: string
  productName_detail: string
  engName_detail: string
  description_detail: Object
  ingredients_detail: Object
  guide_detail: Object
  specification_detail: Object
  main_images_detail: string[]
  sub_images_detail: string[]
  filter_brand?: ObjectId
  filter_dac_tinh?: ObjectId
  filter_hsk_ingredients?: ObjectId
  filter_hsk_product_type?: ObjectId
  filter_hsk_size?: ObjectId
  filter_hsk_skin_type?: ObjectId
  filter_hsk_uses?: ObjectId
  filter_origin?: ObjectId
  quantity: number
  state?: ProductState
}

export interface UpdateProductStateReqBody {
  state: ProductState;
}