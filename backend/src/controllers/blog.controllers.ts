import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { Filter } from 'mongodb'
import { BlogPostState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { BLOG_MESSAGES } from '~/constants/messages'
import BlogPost from '~/models/schemas/Blogs/BlogPost.schema'
import { blogService } from '~/services/blog.services'
import databaseService from '~/services/database.services'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import { CreateNewPostReqBody, PostParam, UpdatePostReqBody } from '~/models/requests/Blog.requests'

export const getAllPostsController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<BlogPost> = {}
  if (req.query.status) {
    filter.status = req.query.status as BlogPostState
  }
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

export const getPostDetailController = async(req:Request<PostParam>, res: Response) => {
    const {id} = req.params
    const result = await blogService.getPostDetail(id)
    res.json({
    message: BLOG_MESSAGES.GET_POST_DETAIL_SUCCESS,
    result
  })
}

export const updatePostController = async(req:Request<PostParam, any, UpdatePostReqBody>, res: Response) => {
    const {id} = req.params
    const result = await blogService.updatePost(id, req.body)
    res.json({
    message: BLOG_MESSAGES.GET_POST_DETAIL_SUCCESS,
    result
  })
}

export const deletePostController = async(req:Request<PostParam>, res: Response) => {
    const {id} = req.params
    const result = await blogService.deletePost(id)
    res.json({
    message: BLOG_MESSAGES.GET_POST_DETAIL_SUCCESS,
    result
  })
}
