import { ObjectId } from 'mongodb'

interface BlogPostCategoriesType {
  postId: ObjectId
  categoryId: ObjectId
}

export default class BlogPostCategories {
  postId: ObjectId
  categoryId: ObjectId

  constructor(postCategories: BlogPostCategoriesType) {
    this.postId = postCategories.postId 
    this.categoryId = postCategories.categoryId
  }
}
