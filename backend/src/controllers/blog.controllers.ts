import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { Filter, ObjectId } from 'mongodb'
import { ADMIN_MESSAGES, BLOG_MESSAGES } from '~/constants/messages'
import { blogService } from '~/services/blog.services'
import databaseService from '~/services/database.services'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import {
  CreateNewPostReqBody,
  PostByIdParam,
  PostBySlugIdParam,
  UpdatePostReqBody
} from '~/models/requests/Blog.requests'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import HTTP_STATUS from '~/constants/httpStatus'
import { PostState } from '~/constants/enums'
import Post from '~/models/schemas/Blog.schema'

export const getAllPostsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = buildPostFilter(req)
    const { page = 1, limit = 10 } = req.query

    const skip = (Number(page) - 1) * Number(limit)

    // Các field filter
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

    //Hàm để build $lookup cho filter
    const buildFilterLookup = (collection: string) => ({
      $lookup: {
        from: collection,
        let: { ids: `$${collection}` },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', '$$ids'] } } },
          { $project: { _id: 1, option_name: 1 } }
        ],
        as: collection
      }
    })

    const pipeline: any[] = [
      { $match: filter },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: Number(limit) },

      //ép kiểu filter_* từ string -> ObjectId
      {
        $addFields: filterFields.reduce(
          (acc, field) => {
            acc[field] = {
              $map: {
                input: { $ifNull: [`$${field}`, []] },
                as: 'id',
                in: {
                  $cond: [
                    { $eq: [{ $type: '$$id' }, 'string'] },
                    { $toObjectId: '$$id' },
                    '$$id'
                  ]
                }
              }
            }
            return acc
          },
          {} as Record<string, any>
        )
      },

      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },

      //Lookups cho filter (chỉ lấy _id + option_name)
      ...filterFields.map(buildFilterLookup),

      {
        $project: {
          authorId: 0,
          'author.password': 0,
          'author.email_verify_token': 0,
          'author.forgot_password_token': 0
        }
      }
    ]

    const [results, total] = await Promise.all([
      databaseService.posts.aggregate(pipeline).toArray(),
      databaseService.posts.countDocuments(filter)
    ])

    res.json({
      data: results,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    })
  } catch (error) {
    next(error)
  }
}


export const getAllPublishPostsController = async (req: Request, res: Response, next: NextFunction) => {
  const filter = buildPostFilter(req, PostState.PUBLISHED)
  await sendPaginatedResponse(res, next, databaseService.posts, req.query, filter)
}

function buildPostFilter(req: Request, forceStatus?: PostState): Filter<Post> {
  const filter: Filter<Post> = {}

  if (forceStatus) {
    filter.status = forceStatus
  } else if (req.query.status) {
    filter.status = req.query.status as PostState
  }

  const filterFields = [
    'filter_brand',
    'filter_dac_tinh',
    'filter_hsk_ingredients',
    'filter_hsk_product_type',
    'filter_hsk_size',
    'filter_hsk_skin_type',
    'filter_hsk_uses',
    'filter_origin'
  ]

  filterFields.forEach((field) => {
    if (req.query[field]) {
      filter[field as keyof Filter<Post>] = new ObjectId(req.query[field] as string)
    }
  })

  return filter
}

export const createNewPostController = async (
  req: Request<ParamsDictionary, any, CreateNewPostReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const result = await blogService.createNewPost(req.body, user_id)
  res.json({
    message: BLOG_MESSAGES.CREATE_NEW_POST_SUCCESS,
    result
  })
}

export const getPostBySlugIdController = async (req: Request<PostBySlugIdParam>, res: Response) => {
  const { slugAndId } = req.params

  const m = slugAndId.match(/-(?<id>[0-9a-fA-F]{24})$/)
  if (!m || !m.groups?.id) {
    res.status(400).json({ message: BLOG_MESSAGES.INVALID_URL })
    return
  }

  const id = m.groups.id
  const slug = slugAndId.slice(0, slugAndId.length - id.length - 1)

  const post = await blogService.getPostById(id)

  if (!post) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: BLOG_MESSAGES.POST_NOT_FOUND
    })
    return
  }

  //Nếu slug không khớp -> redirect SEO-friendly
  if (post.slug !== slug) {
    res.redirect(
      301,
      `/posts/${post.slug}-${id}` //điều hướng đến URL đúng
    )
    return
  }
  res.json({
    message: BLOG_MESSAGES.GET_POST_DETAIL_SUCCESS,
    result: post
  })
}

export const updatePostController = async (req: Request<PostByIdParam, any, UpdatePostReqBody>, res: Response) => {
  const { id } = req.params
  const result = await blogService.updatePost(id, req.body)
  res.json({
    message: BLOG_MESSAGES.UPDATE_POST_SUCCESS,
    result
  })
}

export const deletePostController = async (req: Request<PostByIdParam>, res: Response) => {
  const { id } = req.params
  const result = await blogService.deletePost(id)
  res.json({
    message: BLOG_MESSAGES.DELETE_POST_SUCCESS,
    result
  })
}
