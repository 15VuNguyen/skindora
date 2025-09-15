import { ObjectId } from 'mongodb'

interface BlogCategoryType {
  _id?: ObjectId
  name: string
  slug: string
}

export default class BlogCategory {
  _id?: ObjectId
  name: string
  slug: string

  constructor(category: BlogCategoryType) {
    this._id = category._id || new ObjectId()
    this.name = category.name
    this.slug = category.slug
  }
}
