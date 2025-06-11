import { Router } from 'express'
import { getAllProductController } from '~/controllers/products.controllers'
import { isAdminValidator } from '~/middlewares/admin.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const productRouter = Router()
productRouter.get('/get-all', accessTokenValidator, wrapAsync(getAllProductController))
export default productRouter
