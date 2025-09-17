import { Router } from 'express'
import { createNewPostController, deletePostController, getAllPostsController, getPostDetailController, updatePostController,  } from '~/controllers/blog.controllers'
import { isStaffValidator } from '~/middlewares/staff.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const blogRouter = Router()

blogRouter
  .route('/')
  .get(getAllPostsController)
  .post(accessTokenValidator, isStaffValidator, wrapAsync(createNewPostController))

blogRouter
  .route('/:id')
  .get(getPostDetailController)
  .put(accessTokenValidator, isStaffValidator, wrapAsync(updatePostController))
  .delete(accessTokenValidator, isStaffValidator, wrapAsync(deletePostController)) //soft delete(set status = archived)

export default blogRouter
