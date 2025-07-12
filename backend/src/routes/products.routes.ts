import { Router } from 'express'
import {
  getAllProductController,
  userGetAllProductController,
  userGetAllProductControllerWithQ
} from '~/controllers/products.controllers'
import { isAdminValidator } from '~/middlewares/admin.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
import { getProductDetailController } from '~/controllers/products.controllers'
import { getAllFilterHskProductTypesController } from '~/controllers/filterHskProductType.controllers'

const productRouter = Router()

productRouter.get('/get-all', wrapAsync(userGetAllProductController))
productRouter.get('/v1/get-all', wrapAsync(userGetAllProductControllerWithQ))
productRouter.get('/:_id', wrapAsync(getProductDetailController))
productRouter.get('/get-all-filter-hsk-product-types', wrapAsync(getAllFilterHskProductTypesController))
export default productRouter
