import { Router } from 'express'
import {
  userGetAllProductController,
  userGetAllProductControllerWithQ,
  userSearchProductsController
} from '~/controllers/products.controllers'
import { wrapAsync } from '~/utils/handler'
import { getProductDetailController } from '~/controllers/products.controllers'
import { getAllFilterHskProductTypesController } from '~/controllers/filterHskProductType.controllers'
import { paginationValidator, searchFilterOptionNameValidator } from '~/middlewares/common.middlewares'

const productRouter = Router()
productRouter.get(
  '/search',
  paginationValidator,
  searchFilterOptionNameValidator,
  wrapAsync(userSearchProductsController)
)
productRouter.get('/get-all', wrapAsync(userGetAllProductController))
productRouter.get('/v1/get-all', wrapAsync(userGetAllProductControllerWithQ))
productRouter.get('/get-all-filter-hsk-product-types', wrapAsync(getAllFilterHskProductTypesController))

productRouter.get('/:_id', wrapAsync(getProductDetailController))
export default productRouter
