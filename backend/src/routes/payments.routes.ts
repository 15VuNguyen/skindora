import { Router } from 'express'
import { wrapAsync } from '~/utils/handler'
import createOrder from '~/services/Payments/zalopay.services'
import { createPaymentUrlController } from '~/controllers/payments.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { zaloPayCallback } from '~/services/Payments/zalopay.callbacks'
import { vnpayReturn } from '~/services/Payments/vnpay.callbacks'
import { checkOutValidator, productInStockValidator, savePendingOrderToRedis } from '~/middlewares/orders.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { OrderReqBody } from '~/models/requests/Orders.requests'

const paymentsRouter = Router()

paymentsRouter.post(
  '/zalopay',
  accessTokenValidator,
  productInStockValidator,
  checkOutValidator,
  filterMiddleware<OrderReqBody>([
    'ShipAddress',
    'Description',
    'RequireDate',
    'PaymentMethod',
    'PaymentStatus',
    'voucherCode',
    'type'
  ]),
  savePendingOrderToRedis,
  wrapAsync(createOrder)
)
paymentsRouter.post(
  '/vnpay',
  accessTokenValidator,
  productInStockValidator,
  checkOutValidator,
  filterMiddleware<OrderReqBody>([
    'ShipAddress',
    'Description',
    'RequireDate',
    'PaymentMethod',
    'PaymentStatus',
    'voucherCode',
    'type'
  ]),
  savePendingOrderToRedis,
  wrapAsync(createPaymentUrlController)
)
paymentsRouter.get('/vnpay_return', wrapAsync(vnpayReturn))
paymentsRouter.post('/zalopay_callbacks', wrapAsync(zaloPayCallback))

export default paymentsRouter
