import { ObjectId } from 'mongodb'
import { CreateNewPostReqBody, UpdatePostData, UpdatePostReqBody } from '~/models/requests/Blog.requests'
import databaseService from './database.services'
import { BlogState } from '~/constants/enums'
import { removeVietnameseTones } from '~/utils/string'
import Blog from '~/models/schemas/Blog.schema'
import { ErrorWithStatus } from '~/models/Errors'
import { BLOG_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import User from '~/models/schemas/User.schema'

class BlogService {
  async createNewPost(payload: CreateNewPostReqBody, userId: string) {
    const postId = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const slug = this.generateSlug(payload.title)
    const post = await databaseService.blogs.findOne({ slug })
    if (post) {
      throw new ErrorWithStatus({
        message: BLOG_MESSAGES.EXISTED_POST_WITH_SLUG,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const newPost = new Blog({
      ...payload,
      _id: postId,
      slug,
      authorId: new ObjectId(payload.authorId || userId),
      status: payload.status || BlogState.DRAFT,
      publishedAt: payload.status === BlogState.PUBLISHED ? localTime : undefined,
      created_at: localTime,
      updated_at: localTime
    })
    const filterFields = [
      'filter_brand',
      'filter_dac_tinh',
      'filter_hsk_ingredients',
      'filter_hsk_product_type',
      'filter_hsk_size',
      'filter_hsk_skin_type',
      'filter_hsk_uses',
      'filter_origin'
    ] as const

    filterFields.forEach((field) => {
      if (payload[field] && payload[field]!.length > 0) {
        newPost[field] = payload[field]!.map((id) => new ObjectId(id))
      }
    })

    await databaseService.blogs.insertOne(newPost)
    return newPost
  }

  async getPostById(id: string) {
    const post = await databaseService.blogs.findOne({ _id: new ObjectId(id) })
    if (!post) return null

    const user = await databaseService.users.findOne({ _id: post?.authorId })
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const { authorId, ...rest } = post as Blog
    const { password, email_verify_token, forgot_password_token, ...restUser } = user as User

    const filterCollections = {
      filter_brand: databaseService.filterBrand,
      filter_dac_tinh: databaseService.filterDacTinh,
      filter_hsk_ingredients: databaseService.filterHskIngredient,
      filter_hsk_product_type: databaseService.filterHskProductType,
      filter_hsk_size: databaseService.filterHskSize,
      filter_hsk_skin_type: databaseService.filterHskSkinType,
      filter_hsk_uses: databaseService.filterHskUses,
      filter_origin: databaseService.filterOrigin
    }

    const populatedFilters: Record<string, any[]> = {}
    for (const [field, collection] of Object.entries(filterCollections)) {
      if ((post as any)[field] && (post as any)[field].length > 0) {
        populatedFilters[field] = await collection.find({ _id: { $in: (post as any)[field] } }).toArray()
      }
    }
    return {
      ...rest,
      author: restUser,
      ...populatedFilters
    }
  }

  async updatePost(postId: string, data: UpdatePostReqBody) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    let updatedData: UpdatePostData = {
      ...data,
      updated_at: localTime
    }
    if (updatedData.title) {
      const slug = this.generateSlug(updatedData.title)
      updatedData.slug = slug
      const post = await databaseService.blogs.findOne({ slug })
      if (post) {
        throw new ErrorWithStatus({
          message: BLOG_MESSAGES.EXISTED_POST_WITH_SLUG,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    }

    const post = await databaseService.blogs.findOne({ _id: new ObjectId(postId) })

    if (post?.status !== BlogState.PUBLISHED && updatedData.status === BlogState.PUBLISHED) {
      updatedData.publishedAt = localTime
    } else if (data.status === BlogState.DRAFT) {
      updatedData.publishedAt = undefined
    }
    return await databaseService.blogs.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: updatedData },
      { returnDocument: 'after' }
    )
  }

  async deletePost(postId: string) {
    const post = await databaseService.blogs.findOne({ _id: new ObjectId(postId) })
    if (!post) {
      throw new ErrorWithStatus({
        message: BLOG_MESSAGES.POST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.blogs.deleteOne({_id: new ObjectId(postId)})
  }

  private generateSlug(title: string) {
    return removeVietnameseTones(title)
      .replace(/[^a-z0-9]+/g, '-') //replace space & special chars with -
      .replace(/(^-|-$)+/g, '') //(^-): match - at beginning, (-$): match - at the end, +: match one or more => trim all '-' at the beginning or end
  }
}

export const blogService = new BlogService()
