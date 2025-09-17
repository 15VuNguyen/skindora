import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { Filter, ObjectId } from 'mongodb'
import { BlogState } from '~/constants/enums'
import { BLOG_MESSAGES } from '~/constants/messages'
import { blogService } from '~/services/blog.services'
import databaseService from '~/services/database.services'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import { CreateNewPostReqBody, PostParam, UpdatePostReqBody } from '~/models/requests/Blog.requests'
import Blog from '~/models/schemas/Blog.schema'

export const getAllPostsController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<Blog> = {}
  if (req.query.status) {
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
      //if field exist in query
      filter[field as keyof Filter<Blog>] = new ObjectId(req.query[field] as string)
    }
  })
  await sendPaginatedResponse(res, next, databaseService.blogPosts, req.query, filter)
}

export const createNewPostController = async (
  req: Request<ParamsDictionary, any, CreateNewPostReqBody>,
  res: Response
) => {
  const result = await blogService.createNewPost(req.body)
  res.json({
    message: BLOG_MESSAGES.CREATE_NEW_POST_SUCCESS,
    result
  })
}

export const getPostDetailController = async (req: Request<PostParam>, res: Response) => {
  const { id } = req.params
  const result = await blogService.getPostDetail(id)
  res.json({
    message: BLOG_MESSAGES.GET_POST_DETAIL_SUCCESS,
    result
  })
}

export const updatePostController = async (req: Request<PostParam, any, UpdatePostReqBody>, res: Response) => {
  const { id } = req.params
  const result = await blogService.updatePost(id, req.body)
  res.json({
    message: BLOG_MESSAGES.GET_POST_DETAIL_SUCCESS,
    result
  })
}

export const deletePostController = async (req: Request<PostParam>, res: Response) => {
  const { id } = req.params
  const result = await blogService.deletePost(id)
  res.json({
    message: BLOG_MESSAGES.GET_POST_DETAIL_SUCCESS,
    result
  })
}
