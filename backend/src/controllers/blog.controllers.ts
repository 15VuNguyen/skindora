import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { Filter, ObjectId } from 'mongodb'
import { BlogState } from '~/constants/enums'
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
import Blog from '~/models/schemas/Blog.schema'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import HTTP_STATUS from '~/constants/httpStatus'

export const getAllPostsController = async (req: Request, res: Response, next: NextFunction) => {
  const filter = buildBlogFilter(req)
  await sendPaginatedResponse(res, next, databaseService.blogs, req.query, filter)
}

export const getAllPublishPostsController = async (req: Request, res: Response, next: NextFunction) => {
  const filter = buildBlogFilter(req, BlogState.PUBLISHED)
  await sendPaginatedResponse(res, next, databaseService.blogs, req.query, filter)
}


function buildBlogFilter(req: Request, forceStatus?: BlogState): Filter<Blog> {
  const filter: Filter<Blog> = {}

  if (forceStatus) {
    filter.status = forceStatus
  } else if (req.query.status) {
    filter.status = req.query.status as BlogState
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
      filter[field as keyof Filter<Blog>] = new ObjectId(req.query[field] as string)
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


export const getPostBySlugIdController = async (
  req: Request<PostBySlugIdParam>,
  res: Response
) => {
  const { slugAndId } = req.params

  const m = slugAndId.match(/-(?<id>[0-9a-fA-F]{24})$/)
  if (!m || !m.groups?.id) {
    res.status(400).json({ message: 'URL format invalid, expected ...-<ObjectId>' })
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
      `/blogs/${post.slug}-${id}` //điều hướng đến URL đúng
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
