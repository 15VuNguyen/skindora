import { Router } from 'express'
import {
  createNewPostController,
  deletePostController,
  getAllPostsController,
  getPostBySlugIdController,
  updatePostController
} from '~/controllers/blog.controllers'
import { isAdminOrStaffValidator } from '~/middlewares/admin.middlewares'
import { createBlogValidator, getAllPostsValidator, updateBlogValidator } from '~/middlewares/blogs.middlewares'
import { isStaffValidator } from '~/middlewares/staff.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const blogRouter = Router()

blogRouter
  .route('/')
  .post(accessTokenValidator, isStaffValidator, createBlogValidator, wrapAsync(createNewPostController))

blogRouter
  .route('/get-all')
  .post(accessTokenValidator, isAdminOrStaffValidator, getAllPostsValidator, wrapAsync(getAllPostsController))

blogRouter.route('/:slugAndId').get(wrapAsync(getPostBySlugIdController))

blogRouter
  .route('/:id')
  .put(accessTokenValidator, isStaffValidator, updateBlogValidator, wrapAsync(updatePostController))
  .delete(accessTokenValidator, isStaffValidator, wrapAsync(deletePostController)) //soft delete(set status = archived)

export default blogRouter
