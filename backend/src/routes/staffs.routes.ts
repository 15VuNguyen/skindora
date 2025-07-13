import { Router } from 'express'
import {
  adminSearchProductsByNameController,
  getLowStockProductsController,
  getOnSaleProductsController,
  getOutOfStockProductsController
} from '~/controllers/admin.controllers'
import {
  getAllProductController,
  getProductDetailController,
  getProductStatsController
} from '~/controllers/products.controllers'
import { staffGetAllProductController } from '~/controllers/staffs.controllers'
import { paginationValidator, searchFilterOptionNameValidator } from '~/middlewares/common.middlewares'
import { isStaffValidator } from '~/middlewares/staff.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const staffRouter = Router()
staffRouter.get(
  '/manage-products/search-by-name',
  accessTokenValidator,
  isStaffValidator,
  paginationValidator,
  searchFilterOptionNameValidator,
  wrapAsync(adminSearchProductsByNameController)
)

staffRouter.get('/manage-products/stats', accessTokenValidator, isStaffValidator, wrapAsync(getProductStatsController))

staffRouter.get(
  '/manage-products/get-all',
  accessTokenValidator,
  isStaffValidator,
  wrapAsync(staffGetAllProductController)
)

staffRouter.get(
  '/manage-products/on-sale',
  accessTokenValidator,
  isStaffValidator,
  paginationValidator,
  wrapAsync(getOnSaleProductsController)
)

staffRouter.get(
  '/manage-products/low-stock',
  accessTokenValidator,
  isStaffValidator,
  paginationValidator,
  wrapAsync(getLowStockProductsController)
)

staffRouter.get(
  '/manage-products/out-of-stock',
  accessTokenValidator,
  isStaffValidator,
  paginationValidator,
  wrapAsync(getOutOfStockProductsController)
)

staffRouter.get('/manage-products/:_id', accessTokenValidator, isStaffValidator, wrapAsync(getProductDetailController))

export default staffRouter
