import { Router } from 'express'
import { wrapAsync } from '~/utils/handler'
import createOrder from '~/services/Payments/zalopay.services'
import { createPaymentUrlController, paymentReturn } from '~/controllers/payments.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { zaloPayCallback } from '~/services/Payments/zalopay.callbacks'
import { vnpayReturn } from '~/services/Payments/vnpay.callbacks'

const paymentsRouter = Router()

paymentsRouter.post('/zalopay', accessTokenValidator, wrapAsync(createOrder))
paymentsRouter.post('/vnpay', accessTokenValidator, wrapAsync(createPaymentUrlController))
paymentsRouter.get('/vnpay_return', wrapAsync(vnpayReturn))
paymentsRouter.post('/zalopay_callbacks', wrapAsync(zaloPayCallback))

export default paymentsRouter
