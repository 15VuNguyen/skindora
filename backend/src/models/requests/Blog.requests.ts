import { ObjectId } from 'mongodb'
import { PostState } from '~/constants/enums'
import { ContentType } from '../schemas/Blog.schema'

export interface CreateNewPostReqBody {
  title: string
  content: ContentType
  image_on_list: string
  status?: PostState
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
  content?: ContentType
  image_on_list?: string
  status?: PostState
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
  title_no_accents?: string
  slug?: string
  content?: ContentType
  image_on_list?: string
  status?: PostState
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

export interface getAllPostsReqBody {
  filter_brand?: ObjectId[]
  filter_dac_tinh?: ObjectId[]
  filter_hsk_ingredients?: ObjectId[]
  filter_hsk_product_type?: ObjectId[]
  filter_hsk_size?: ObjectId[]
  filter_hsk_skin_type?: ObjectId[]
  filter_hsk_uses?: ObjectId[]
  filter_origin?: ObjectId[]
}