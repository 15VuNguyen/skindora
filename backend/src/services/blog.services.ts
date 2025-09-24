import { ObjectId } from 'mongodb'
import { CreateNewPostReqBody, UpdatePostData, UpdatePostReqBody } from '~/models/requests/Blog.requests'
import databaseService from './database.services'
import { filterFields, PostState } from '~/constants/enums'
import { removeVietnameseTones } from '~/utils/string'
import { ErrorWithStatus } from '~/models/Errors'
import { BLOG_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import User from '~/models/schemas/User.schema'
import Post from '~/models/schemas/Blog.schema'
import redisClient from './redis.services'

class BlogService {
  async createNewPost(payload: CreateNewPostReqBody, userId: string) {
    const postId = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const slug = this.generateSlug(payload.title)
    const title_no_accents = removeVietnameseTones(payload.title)

    const post = await databaseService.posts.findOne({ slug })
    if (payload.status === PostState.PUBLISHED && post) {
      throw new ErrorWithStatus({
        message: BLOG_MESSAGES.EXISTED_POST_WITH_SLUG,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const newPost = new Post({
      ...this.normalizeFilters(payload),
      _id: postId,
      title_no_accents,
      slug,
      authorId: new ObjectId(payload.authorId || userId),
      status: payload.status || PostState.DRAFT,
      publishedAt: payload.status === PostState.PUBLISHED ? localTime : undefined,
      created_at: localTime,
      updated_at: localTime
    })

    await databaseService.posts.insertOne(newPost)
    return newPost
  }

  async getPostById(id: string) {
    const post = await databaseService.posts.findOne({ _id: new ObjectId(id) })
    if (!post) return null

    const user = await databaseService.users.findOne({ _id: post?.authorId })
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const currentViews = await this.getCurrentViews(id)

    const { authorId, view_count, ...rest } = post as Post
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

    await this.increasePostView(id)

    return {
      ...rest,
      view_count: currentViews,
      author: restUser,
      ...populatedFilters
    }
  }

  async updatePost(postId: string, data: UpdatePostReqBody) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    let updatedData: UpdatePostData = {
      ...this.normalizeFilters(data),
      updated_at: localTime
    }

    const post = await databaseService.posts.findOne({ _id: new ObjectId(postId) })

    if (updatedData.title) {
      updatedData.slug = this.generateSlug(updatedData.title)
      updatedData.title_no_accents = removeVietnameseTones(updatedData.title)
    } else {
      updatedData.slug = post?.slug
    }

    if (post!.status !== PostState.PUBLISHED && updatedData.status === PostState.PUBLISHED) {
      if (updatedData.slug) {
        const existed = await databaseService.posts.findOne({
          slug: updatedData.slug,
          status: PostState.PUBLISHED,
          _id: { $ne: post!._id }
        })
        if (existed) {
          throw new ErrorWithStatus({
            message: BLOG_MESSAGES.EXISTED_POST_WITH_SLUG,
            status: HTTP_STATUS.BAD_REQUEST
          })
        }
      }
      updatedData.publishedAt = localTime
    } else if (updatedData.status === PostState.DRAFT) {
      updatedData.publishedAt = undefined
    }

    return await databaseService.posts.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: updatedData },
      { returnDocument: 'after' }
    )
  }

  async deletePost(postId: string) {
    const post = await databaseService.posts.findOne({ _id: new ObjectId(postId) })
    if (!post) {
      throw new ErrorWithStatus({
        message: BLOG_MESSAGES.POST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await databaseService.posts.deleteOne({ _id: new ObjectId(postId) })
  }

  private generateSlug(title: string) {
    return removeVietnameseTones(title)
      .replace(/[^a-z0-9]+/g, '-') //replace space & special chars with -
      .replace(/(^-|-$)+/g, '') //(^-): match - at beginning, (-$): match - at the end, +: match one or more => trim all '-' at the beginning or end
  }

  normalizeFilters<T extends Record<string, any>>(data: T): T {
    filterFields.forEach((field) => {
      const key = field as keyof T
      if (data[key] && data[key]!.length > 0) {
        data[key] = data[key]!.map((id: string | ObjectId) => (typeof id === 'string' ? new ObjectId(id) : id))
      }
    })
    return data
  }

  private getPostViewKeyById(postId: string) {
    return `${process.env.POST_KEY}${postId}:views`
  }

  private async increasePostView(postId: string) {
    //key: post:postId:views
    const key = this.getPostViewKeyById(postId)
    return await redisClient.incr(key)
  }

  private async parseIntPostView(key: string) {
    return redisClient.get(key).then((val) => parseInt(val || '0', 10))
  }

  async syncPostViews(batchSize = 100) {
    let cursor = '0'

    do {
      const { cursor: nextCursor, keys } = await redisClient.scan(cursor, {
        MATCH: `${process.env.POST_KEY}*:views`,
        COUNT: batchSize
      })
      cursor = nextCursor

      if (keys.length > 0) {
        const pipeline = redisClient.multi()
        keys.forEach((key) => pipeline.get(key))
        const results = await pipeline.exec()

        await Promise.all(
          (keys as string[]).map(async (key, i) => {
            const result = results[i]
            const count = parseInt(Array.isArray(result) && result[1] ? result[1] : '0', 10)
            if (count > 0) {
              const postId = key.split(':')[1]
              await databaseService.posts.updateOne({ _id: new ObjectId(postId) }, { $inc: { view_count: count } })
            }
          })
        )

        await redisClient.del(keys)
      }
    } while (cursor !== '0')
  }

  async getCurrentViews(postId: string) {
    const post = await databaseService.posts.findOne({ _id: new ObjectId(postId) })
    const dbViews = post?.view_count || 0

    const key = this.getPostViewKeyById(postId)
    const redisViews = await this.parseIntPostView(key)

    return dbViews + redisViews
  }
}

export const blogService = new BlogService()
