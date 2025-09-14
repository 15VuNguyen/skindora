import { ObjectId } from 'mongodb'
import { BlogPostState } from '~/constants/enums'

interface BlogPostType {
  _id?: ObjectId
  title: string
  slug: string
  content: string
  status: BlogPostState
  publishedAt?: Date
  authorId: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class BlogPost {
  _id?: ObjectId
  title: string
  slug: string
  content: string
  status: BlogPostState
  publishedAt?: Date
  authorId: ObjectId
  created_at: Date
  updated_at: Date

  constructor(post: BlogPostType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = post._id || new ObjectId()
    this.title = post.title
    this.slug = post.slug
    this.content = post.content
    this.status = post.status || BlogPostState.draft
    this.publishedAt = post.publishedAt || localTime
    this.authorId = post.authorId
    this.created_at = post.created_at || localTime
    this.updated_at = post.updated_at || localTime
  }
}
