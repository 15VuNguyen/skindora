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
  filter_ingredients?: ObjectId
  filter_product_type?: ObjectId
  filter_size?: ObjectId
  filter_skin_type?: ObjectId
  filter_uses?: ObjectId
  filter_origin?: ObjectId
  quantity?: number
  state?: ProductState
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId
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
  filter_ingredients?: ObjectId
  filter_product_type?: ObjectId
  filter_size?: ObjectId
  filter_skin_type?: ObjectId
  filter_uses?: ObjectId
  filter_origin?: ObjectId
  quantity?: number
  state?: ProductState
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId

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
    this.filter_brand = product.filter_brand || new ObjectId()
    this.filter_dac_tinh = product.filter_dac_tinh || new ObjectId()
    this.filter_ingredients = product.filter_ingredients || new ObjectId()
    this.filter_product_type = product.filter_product_type || new ObjectId()
    this.filter_size = product.filter_size || new ObjectId()
    this.filter_skin_type = product.filter_skin_type || new ObjectId()
    this.filter_uses = product.filter_uses || new ObjectId()
    this.filter_origin = product.filter_origin || new ObjectId()
    this.quantity = product.quantity || 0
    this.state = product.state || ProductState.ACTIVE
    this.created_at = localTime || product.created_at
    this.updated_at = localTime || product.updated_at
    this.modified_by = product.modified_by
  }
}
