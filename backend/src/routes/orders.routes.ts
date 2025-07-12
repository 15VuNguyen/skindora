import { wrapAsync } from '~/utils/handler'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { Router } from 'express'
import {
  approveCancelRequestController,
  buyNowController,
  cancelOrderController,
  checkOutController,
  countOrderController,
  getAllCancelledOrdersController,
  getAllOrdersByAuthUserController,
  getAllOrdersByUserIdController,
  getAllOrdersController,
  getCurrentOrderController,
  getOrderByIdController,
  moveToNextStatusController,
  prepareOrderController,
  rejectCancelRequestController,
  requestCancelOrderController
} from '~/controllers/orders.controllers'
import { isAdminOrStaffValidator } from '~/middlewares/admin.middlewares'
import {
  buyNowValidator,
  cancelledOrderRequestedValidator,
  cancelOrderValidator,
  checkOutValidator,
  getAllCancelledOrdersValidator,
  getAllOrdersValidator,
  getNextOrderStatusValidator,
  getOrderByIdValidator,
  prepareOrderValidator,
  requestCancelOrderValidator
} from '~/middlewares/orders.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { OrderReqBody } from '~/models/requests/Orders.requests'

const ordersRouter = Router()

ordersRouter
  .route('/')
  .get(accessTokenValidator, isAdminOrStaffValidator, getAllOrdersValidator, wrapAsync(getAllOrdersController))

ordersRouter.route('/counts').get(accessTokenValidator, isAdminOrStaffValidator, wrapAsync(countOrderController))

ordersRouter
  .route('/cancel')
  .get(
    accessTokenValidator,
    isAdminOrStaffValidator,
    getAllCancelledOrdersValidator,
    wrapAsync(getAllCancelledOrdersController)
  )

ordersRouter
  .route('/users/:userId')
  .get(accessTokenValidator, isAdminOrStaffValidator, wrapAsync(getAllOrdersByUserIdController))

ordersRouter.route('/current').get(accessTokenValidator, wrapAsync(getCurrentOrderController))

ordersRouter.route('/me').get(accessTokenValidator, wrapAsync(getAllOrdersByAuthUserController))

ordersRouter
  .route('/:orderId/next-status')
  .patch(
    accessTokenValidator,
    isAdminOrStaffValidator,
    getNextOrderStatusValidator,
    wrapAsync(moveToNextStatusController)
  )

ordersRouter
  .route('/:orderId/cancel-request')
  .post(accessTokenValidator, requestCancelOrderValidator, wrapAsync(requestCancelOrderController))
ordersRouter
  .route('/:orderId/cancel-request/approve')
  .patch(
    accessTokenValidator,
    isAdminOrStaffValidator,
    cancelledOrderRequestedValidator,
    wrapAsync(approveCancelRequestController)
  )
ordersRouter
  .route('/:orderId/cancel-request/reject')
  .patch(
    accessTokenValidator,
    isAdminOrStaffValidator,
    cancelledOrderRequestedValidator,
    wrapAsync(rejectCancelRequestController)
  )

ordersRouter
  .route('/:orderId/cancel')
  .patch(accessTokenValidator, isAdminOrStaffValidator, cancelOrderValidator, wrapAsync(cancelOrderController))

ordersRouter.route('/:orderId').get(accessTokenValidator, getOrderByIdValidator, wrapAsync(getOrderByIdController))

ordersRouter.route('/cart').post(accessTokenValidator, prepareOrderValidator, wrapAsync(prepareOrderController))

ordersRouter.route('/buy-now').post(accessTokenValidator, buyNowValidator, wrapAsync(buyNowController))

ordersRouter
  .route('/checkout')
  .post(
    accessTokenValidator,
    filterMiddleware<OrderReqBody>([
      'RecipientName',
      'PhoneNumber',
      'ShipAddress',
      'Description',
      'RequireDate',
      'PaymentMethod',
      'PaymentStatus',
      'voucherCode',
      'type'
    ]),
    checkOutValidator,
    wrapAsync(checkOutController)
  )

export default ordersRouter
