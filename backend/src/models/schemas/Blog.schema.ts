import { ObjectId } from 'mongodb'
import { PostState } from '~/constants/enums'

export interface ContentType {
  rawHtml: string
  plainText: string
}

interface PostType {
  _id?: ObjectId
  title: string
  title_no_accents: string
  slug: string
  content: ContentType
  image_on_list: string
  status: PostState
  publishedAt?: Date
  authorId: ObjectId
  filter_brand?: ObjectId[]
  filter_dac_tinh?: ObjectId[]
  filter_hsk_ingredients?: ObjectId[]
  filter_hsk_product_type?: ObjectId[]
  filter_hsk_size?: ObjectId[]
  filter_hsk_skin_type?: ObjectId[]
  filter_hsk_uses?: ObjectId[]
  filter_origin?: ObjectId[]
  view_count?: number
  created_at?: Date
  updated_at?: Date
}

export default class Post {
  _id?: ObjectId
  title: string
  title_no_accents: string
  slug: string
  content: ContentType
  image_on_list: string
  status: PostState
  publishedAt?: Date
  authorId: ObjectId
  filter_brand: ObjectId[]
  filter_dac_tinh: ObjectId[]
  filter_hsk_ingredients: ObjectId[]
  filter_hsk_product_type: ObjectId[]
  filter_hsk_size: ObjectId[]
  filter_hsk_skin_type: ObjectId[]
  filter_hsk_uses: ObjectId[]
  filter_origin: ObjectId[]
  view_count: number
  created_at: Date
  updated_at: Date

  constructor(blog: PostType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = blog._id ?? new ObjectId()
    this.title = blog.title
    this.title_no_accents = blog.title_no_accents ?? ''
    this.slug = blog.slug
    this.content = {
      rawHtml: blog.content?.rawHtml ?? '',
      plainText: blog.content?.plainText ?? ''
    }
    this.image_on_list = blog.image_on_list ?? ''
    this.status = blog.status || PostState.DRAFT
    this.publishedAt = blog.status === PostState.PUBLISHED ? blog.publishedAt || localTime : undefined
    this.authorId = blog.authorId

    // filters
    this.filter_brand = blog.filter_brand ?? []
    this.filter_dac_tinh = blog.filter_dac_tinh ?? []
    this.filter_hsk_ingredients = blog.filter_hsk_ingredients ?? []
    this.filter_hsk_product_type = blog.filter_hsk_product_type ?? []
    this.filter_hsk_size = blog.filter_hsk_size ?? []
    this.filter_hsk_skin_type = blog.filter_hsk_skin_type ?? []
    this.filter_hsk_uses = blog.filter_hsk_uses ?? []
    this.filter_origin = blog.filter_origin ?? []
    this.view_count = blog.view_count ?? 0
    this.created_at = blog.created_at || localTime
    this.updated_at = blog.updated_at || localTime
  }
}
