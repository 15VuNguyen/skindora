import { ObjectId } from 'mongodb'
import { BlogState } from '~/constants/enums'

export interface CreateNewPostReqBody {
  title: string
  content: string
  status?: BlogState
  authorId?: string
  filter_brand?: ObjectId[]
  filter_dac_tinh?: ObjectId[]
  filter_hsk_ingredients?: ObjectId[]
  filter_hsk_product_type?: ObjectId[]
  filter_hsk_size?: ObjectId[]
  filter_hsk_skin_type?: ObjectId[]
  filter_hsk_uses?: ObjectId[]
  filter_origin?: ObjectId[]
}

export interface UpdatePostReqBody {
  title?: string
  content?: string
  status?: BlogState
  filter_brand?: ObjectId[]
  filter_dac_tinh?: ObjectId[]
  filter_hsk_ingredients?: ObjectId[]
  filter_hsk_product_type?: ObjectId[]
  filter_hsk_size?: ObjectId[]
  filter_hsk_skin_type?: ObjectId[]
  filter_hsk_uses?: ObjectId[]
  filter_origin?: ObjectId[]
}

export interface UpdatePostData {
  title?: string
  slug?: string
  content?: string
  status?: BlogState
  publishedAt?: Date
  filter_brand?: ObjectId[]
  filter_dac_tinh?: ObjectId[]
  filter_hsk_ingredients?: ObjectId[]
  filter_hsk_product_type?: ObjectId[]
  filter_hsk_size?: ObjectId[]
  filter_hsk_skin_type?: ObjectId[]
  filter_hsk_uses?: ObjectId[]
  filter_origin?: ObjectId[]
  updated_at: Date
}

export interface PostBySlugIdParam {
  slugAndId: string
}

export interface PostByIdParam {
  id: string
}
