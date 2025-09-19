import { ObjectId } from 'mongodb'
import { BlogState } from '~/constants/enums'

interface BlogType {
  _id?: ObjectId
  title: string
  slug: string
  content: string
  status: BlogState
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
  created_at?: Date
  updated_at?: Date
}

export default class Blog {
  _id?: ObjectId
  title: string
  slug: string
  content: string
  status: BlogState
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
  created_at: Date
  updated_at: Date

  constructor(blog: BlogType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = blog._id || new ObjectId()
    this.title = blog.title
    this.slug = blog.slug
    this.content = blog.content
    this.status = blog.status || BlogState.DRAFT
    this.publishedAt = blog.status === BlogState.PUBLISHED ? blog.publishedAt || localTime : undefined
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
    this.created_at = blog.created_at || localTime
    this.updated_at = blog.updated_at || localTime
  }
}
