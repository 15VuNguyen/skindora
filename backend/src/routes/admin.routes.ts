import { Router } from 'express'
import { getAllUserController } from '~/controllers/admin.controllers'
import { createNewProductController, getAllProductController } from '~/controllers/products.controllers'
import { createNewProductValidator, isAdminValidator } from '~/middlewares/admin.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const adminRouter = Router()
//user management
adminRouter.get('/manage-users/get-all', accessTokenValidator, isAdminValidator, wrapAsync(getAllUserController))

//product management
adminRouter.get('/manage-products/get-all', accessTokenValidator, isAdminValidator, wrapAsync(getAllProductController))
adminRouter.post(
  '/manage-products/create-new-product',
  accessTokenValidator,
  isAdminValidator,
  createNewProductValidator,
  wrapAsync(createNewProductController)
)
export default adminRouter
