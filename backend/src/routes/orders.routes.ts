import { wrapAsync } from '~/utils/handler'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { Router } from 'express'
import {
  buyNowController,
  checkOutController,
  getAllOrdersByAuthUserController,
  getAllOrdersByUserIdController,
  getAllOrdersController,
  getCurrentOrderController,
  getOrderByIdController,
  moveToNextStatusController,
  prepareOrderController,
} from '~/controllers/orders.controllers'
import { isAdminOrStaffValidator } from '~/middlewares/admin.middlewares'
import { checkOutValidator, getAllOrdersValidator, getNextOrderStatusValidator, getOrderByIdValidator } from '~/middlewares/orders.middlewares'
import { isStaffValidator } from '~/middlewares/staff.middlewares'

const ordersRouter = Router()

ordersRouter.route('/').get(accessTokenValidator, isAdminOrStaffValidator, getAllOrdersValidator, wrapAsync(getAllOrdersController))

ordersRouter
  .route('/users/:userId')
  .get(accessTokenValidator, isAdminOrStaffValidator, wrapAsync(getAllOrdersByUserIdController))

ordersRouter.route('/current').get(accessTokenValidator, wrapAsync(getCurrentOrderController))

ordersRouter.route('/me').get(accessTokenValidator, wrapAsync(getAllOrdersByAuthUserController))

ordersRouter.route('/:orderId/next-status').patch(accessTokenValidator, isStaffValidator, getNextOrderStatusValidator, wrapAsync(moveToNextStatusController))

ordersRouter.route('/:orderId').get(accessTokenValidator, getOrderByIdValidator, wrapAsync(getOrderByIdController))

ordersRouter.route('/cart').post(accessTokenValidator, wrapAsync(prepareOrderController))

ordersRouter.route('/buy-now').post(accessTokenValidator, wrapAsync(buyNowController))

ordersRouter.route('/checkout').post(accessTokenValidator, checkOutValidator, wrapAsync(checkOutController))

export default ordersRouter
