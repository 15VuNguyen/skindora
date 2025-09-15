import { ObjectId } from 'mongodb'
import { CreateNewPostReqBody, UpdatePostReqBody } from '~/models/requests/Blog.requests'
import databaseService from './database.services'
import BlogPost from '~/models/schemas/Blogs/BlogPost.schema'
import { BlogPostState } from '~/constants/enums'

class BlogService {
  async createNewPost(payload: CreateNewPostReqBody) {
    const postId = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.blogPosts.insertOne(
      new BlogPost({
        ...payload,
        _id: postId,
        status: payload.status || BlogPostState.DRAFT,
        created_at: localTime,
        updated_at: localTime
      })
    )
    return result
  }

  getPostDetail(postId: string) {
    return databaseService.blogPosts.findOne({ _id: new ObjectId(postId) })
  }

  async updatePost(postId: string, updatedData: UpdatePostReqBody) {
    return await databaseService.blogPosts.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: updatedData },
      { returnDocument: 'after' }
    )
  }

  async deletePost(postId: string) {
    return await databaseService.blogPosts.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: {status: BlogPostState.ARCHIVED} },
      { returnDocument: 'after' }
    )
  }
}

export const blogService = new BlogService()
