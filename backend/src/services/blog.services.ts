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
import { getLocalTime, getVnMidnight } from '~/utils/date'

class BlogService {
  async createNewPost(payload: CreateNewPostReqBody, userId: string) {
    const postId = new ObjectId()
    const localTime = getLocalTime()

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

    const { authorId, ...rest } = post as Post
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

    if (rest.status === PostState.PUBLISHED) {
      await this.increasePostView(id)
    }
    const currentViews = await this.getCurrentViews(id)

    return {
      ...rest,
      views: currentViews,
      author: restUser,
      ...populatedFilters
    }
  }

  async updatePost(postId: string, data: UpdatePostReqBody) {
    const localTime = getLocalTime()

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
            const count = parseInt(result !== null && result !== undefined ? String(result) : '0', 10)
            if (count > 0) {
              const postId = new ObjectId(key.split(':')[1])
              const today = getVnMidnight()

              await databaseService.postViews.updateOne(
                { postId, date: today },
                {
                  $inc: { views: count },
                  $setOnInsert: { created_at: today, updated_at: today }
                },
                { upsert: true }
              )
            }
          })
        )

        await redisClient.del(keys)
      }
      ;('')
    } while (cursor !== '0')
  }

  async getCurrentViews(postId: string) {
    const dbViews =
      (await databaseService.postViews.find({ postId: new ObjectId(postId) }).toArray()).reduce(
        (viewSum, pv) => viewSum + pv.views,
        0
      ) || 0

    const key = this.getPostViewKeyById(postId)
    const redisViews = await this.parseIntPostView(key)

    return dbViews + redisViews
  }
  async getPostViewsStatistic() {
    const startDateOfToday = getVnMidnight()

    const [totalViewsResult] = await databaseService.postViews
      .aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }])
      .toArray()
    const totalViews = totalViewsResult?.totalViews || 0

    const [todayViewsResult] = await databaseService.postViews
      .aggregate([{ $match: { date: startDateOfToday } }, { $group: { _id: null, viewsToday: { $sum: '$views' } } }])
      .toArray()
    const viewsToday = todayViewsResult?.viewsToday || 0

    //Views this month
    const firstDayOfMonth = new Date(startDateOfToday)
    firstDayOfMonth.setDate(1) //0h ngày 1 của tháng theo VN
    const [monthViewsResult] = await databaseService.postViews
      .aggregate([
        { $match: { date: { $gte: firstDayOfMonth, $lte: startDateOfToday } } },
        { $group: { _id: null, viewsThisMonth: { $sum: '$views' } } }
      ])
      .toArray()
    const viewsThisMonth = monthViewsResult?.viewsThisMonth || 0

    //Most viewed post
    const [mostViewedPost] = await databaseService.postViews
      .aggregate([
        { $group: { _id: '$postId', total: { $sum: '$views' } } },
        { $sort: { total: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: '_id',
            as: 'postInfo'
          }
        },
        { $unwind: '$postInfo' }
      ])
      .toArray()

    return {
      totalViews,
      viewsToday,
      viewsThisMonth,
      mostViewedPost: mostViewedPost?.postInfo || null,
      mostViewedPostViews: mostViewedPost?.total || 0
    }
  }

  async getPostViewsByDate({ startDate, endDate, groupBy }: { startDate: string; endDate: string; groupBy: string }) {
    // GET /admin/post-views?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&groupBy=day|month

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const groupFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d'

    const views = await databaseService.postViews
      .aggregate([
        { $match: { date: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: { $dateToString: { format: groupFormat, date: '$date' } },
            views: { $sum: '$views' }
          }
        },
        { $sort: { _id: 1 } }
      ])
      .toArray()

    return views.map((v) => ({ date: v._id, views: v.views }))
  }

  async getTopViewedPosts({ startDate, endDate, limit }: { startDate?: string; endDate?: string; limit?: number }) {
    const match: any = {}
    if (startDate && endDate) {
      match.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    const topPosts = await databaseService.postViews
      .aggregate([
        { $match: match },
        { $group: { _id: '$postId', totalViews: { $sum: '$views' } } },
        { $sort: { totalViews: -1 } },
        { $limit: limit },
        { $lookup: { from: 'posts', localField: '_id', foreignField: '_id', as: 'postInfo' } },
        { $unwind: '$postInfo' }
      ])
      .toArray()

    return topPosts.map((p) => ({
      postId: p._id,
      title: p.postInfo.title,
      slug: p.postInfo.slug,
      totalViews: p.totalViews
    }))
  }

  async getViewsByPost({ postId, startDate, endDate }: { postId: string; startDate?: string; endDate?: string }) {
    const match: any = { postId: new ObjectId(postId) }
    if (startDate && endDate) {
      match.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    const viewsData = await databaseService.postViews.find(match).sort({ date: 1 }).toArray()

    const post = await databaseService.posts
      .aggregate([
        { $match: { _id: new ObjectId(postId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'authorInfo'
          }
        },
        { $unwind: '$authorInfo' },
        {
          $project: {
            _id: 1,
            title: 1,
            slug: 1,
            publishedAt: 1,
            author: {
              first_name: '$authorInfo.first_name',
              last_name: '$authorInfo.last_name'
            }
          }
        }
      ])
      .toArray()

    if (!post || post.length === 0) return null

    const resultPost = post[0]

    const views = viewsData.map((v) => ({
      date: v.date,
      views: v.views
    }))

    return {
      postId: resultPost._id,
      title: resultPost.title,
      slug: resultPost.slug,
      author: resultPost.author,
      publishedAt: resultPost.publishedAt,
      postViews: views
    }
  }

  async getPostViewsGrowth({ days }: { days: number }) {
    const today = getVnMidnight()

    const start = new Date(today)
    start.setDate(today.getDate() - days + 1)

    const views = await databaseService.postViews
      .aggregate([
        { $match: { date: { $gte: start, $lte: today } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            views: { $sum: '$views' }
          }
        },
        { $sort: { _id: -1 } }
      ])
      .toArray()

    //Tính growth % so với ngày trước
    const viewsMap = new Map(views.map((v) => [v._id, v.views]))
    const result = []

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(currentDate.getDate() - i)
      const dateString = currentDate.toISOString().split('T')[0]

      const yesterday = new Date(currentDate)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toISOString().split('T')[0]

      const currentViews = viewsMap.get(dateString) || 0
      const previousDayViews = viewsMap.get(yesterdayString) || 0

      let growth = 0
      if (previousDayViews === 0 && currentViews > 0) {
        growth = 100
      } else if (previousDayViews !== 0) {
        growth = Math.round(((currentViews - previousDayViews) / previousDayViews) * 100)
      }

      result.push({
        date: dateString,
        views: currentViews,
        growth
      })
    }

    return result
  }

  async getOverview() {
    //Đếm total posts, PUBLISHED posts, DRAFT posts,
    const counts = await databaseService.posts
      .aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } }
      ])
      .toArray()

    const totalPosts = counts.reduce((sum, count) => sum + count.count, 0)
    const publishedPosts = counts.find((count) => count.status === 'PUBLISHED')?.count || 0
    const draftPosts = counts.find((count) => count.status === 'DRAFT')?.count || 0

    return {
      totalPosts,
      publishedPosts,
      draftPosts
    }
  }
}

export const blogService = new BlogService()
