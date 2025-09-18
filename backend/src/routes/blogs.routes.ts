import { Router } from 'express'
import { createNewPostController, deletePostController, getAllPostsController, getPostBySlugController, getPostDetailController, updatePostController,  } from '~/controllers/blog.controllers'
import { createBlogValidator, updateBlogValidator } from '~/middlewares/blogs.middlewares'
import { isStaffValidator } from '~/middlewares/staff.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const blogRouter = Router()

blogRouter
  .route('/')
  .get(getAllPostsController)
  .post(accessTokenValidator, isStaffValidator, createBlogValidator, wrapAsync(createNewPostController))

blogRouter.route('/:slug').get(getPostBySlugController)

blogRouter
  .route('/:id')
  .put(accessTokenValidator, isStaffValidator, updateBlogValidator, wrapAsync(updatePostController))
  .delete(accessTokenValidator, isStaffValidator, wrapAsync(deletePostController)) //soft delete(set status = archived)


export default blogRouter
