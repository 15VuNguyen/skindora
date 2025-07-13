import { Router } from 'express'
import { wrapAsync } from '~/utils/handler'
import createOrder from '~/services/Payments/zalopay.services'
import { createPaymentUrlController } from '~/controllers/payments.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { zaloPayCallback } from '~/services/Payments/zalopay.callbacks'
import { vnpayReturn } from '~/services/Payments/vnpay.callbacks'
import {
  paymentOnlineValidator,
  productInStockValidator,
  savePendingOrderToRedis
} from '~/middlewares/orders.middlewares'

const paymentsRouter = Router()

paymentsRouter.post(
  '/zalopay',
  accessTokenValidator,
  productInStockValidator,
  paymentOnlineValidator,
  savePendingOrderToRedis,
  wrapAsync(createOrder)
)
paymentsRouter.post(
  '/vnpay',
  accessTokenValidator,
  productInStockValidator,
  paymentOnlineValidator,
  savePendingOrderToRedis,
  wrapAsync(createPaymentUrlController)
)
paymentsRouter.get('/vnpay_return', wrapAsync(vnpayReturn))
paymentsRouter.get('/zalopay_callbacks', wrapAsync(zaloPayCallback))

export default paymentsRouter
