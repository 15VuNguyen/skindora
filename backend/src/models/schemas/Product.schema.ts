import { ObjectId } from 'mongodb'
import { ProductState } from '~/constants/enums'

interface ProductType {
  _id?: ObjectId
  name_on_list?: string
  engName_on_list?: string
  price_on_list?: string
  image_on_list?: string
  hover_image_on_list?: string
  productName_detail?: string
  engName_detail?: string
  description_detail?: Object
  ingredients_detail?: Object
  guide_detail?: Object
  specification_detail?: Object
  main_images_detail?: string[]
  sub_images_detail?: string[]
  filter_brand?: ObjectId
  filter_dac_tinh?: ObjectId
  filter_hsk_ingredients?: ObjectId
  filter_hsk_product_type?: ObjectId
  filter_hsk_size?: ObjectId
  filter_hsk_skin_type?: ObjectId
  filter_hsk_uses?: ObjectId
  filter_origin?: ObjectId
  quantity?: number
  state?: ProductState
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id?: ObjectId
  name_on_list?: string
  engName_on_list?: string
  price_on_list?: string
  image_on_list?: string
  hover_image_on_list?: string
  productName_detail?: string
  engName_detail?: string
  description_detail?: Object
  ingredients_detail?: Object
  guide_detail?: Object
  specification_detail?: Object
  main_images_detail?: string[]
  sub_images_detail?: string[]
  filter_brand?: ObjectId
  filter_dac_tinh?: ObjectId
  filter_hsk_ingredients?: ObjectId
  filter_hsk_product_type?: ObjectId
  filter_hsk_size?: ObjectId
  filter_hsk_skin_type?: ObjectId
  filter_hsk_uses?: ObjectId
  filter_origin?: ObjectId
  quantity?: number
  state?: ProductState
  created_at?: Date
  updated_at?: Date
  

  constructor(product: ProductType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = product._id || new ObjectId()
    this.name_on_list = product.name_on_list || ''
    this.engName_on_list = product.engName_on_list || ''
    this.price_on_list = product.price_on_list || ''
    this.image_on_list = product.image_on_list || ''
    this.hover_image_on_list = product.hover_image_on_list || ''
    this.productName_detail = product.productName_detail || ''
    this.engName_detail = product.engName_detail || ''
    this.description_detail = product.description_detail || ''
    this.ingredients_detail = product.ingredients_detail || ''
    this.guide_detail = product.guide_detail || ''
    this.specification_detail = product.specification_detail || ''
    this.main_images_detail = product.main_images_detail || []
    this.sub_images_detail = product.sub_images_detail || []
    if (product.filter_brand) {
      this.filter_brand = product.filter_brand
    }
    if (product.filter_dac_tinh) {
      this.filter_dac_tinh = product.filter_dac_tinh
    }
    if (product.filter_hsk_ingredients) {
      this.filter_hsk_ingredients = product.filter_hsk_ingredients
    }
    if (product.filter_hsk_product_type) {
      this.filter_hsk_product_type = product.filter_hsk_product_type
    }
    if (product.filter_hsk_size) {
      this.filter_hsk_size = product.filter_hsk_size
    }
    if (product.filter_hsk_skin_type) {
      this.filter_hsk_skin_type = product.filter_hsk_skin_type
    }
    if (product.filter_hsk_uses) {
      this.filter_hsk_uses = product.filter_hsk_uses
    }
    if (product.filter_origin) {
      this.filter_origin = product.filter_origin
    }
    this.quantity = product.quantity || 0
    this.state = product.state || ProductState.ACTIVE
    this.created_at = product.created_at || localTime
    this.updated_at = product.updated_at || localTime
  }
}
