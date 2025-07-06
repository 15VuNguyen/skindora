import { Router } from 'express'
import { wrapAsync } from '~/utils/handler'
import createOrder from '~/services/Payments/zalopay.services'
import { createPaymentUrlController, paymentReturn } from '~/controllers/payments.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const paymentsRouter = Router()

paymentsRouter.post('/zalopay', accessTokenValidator, wrapAsync(createOrder))
paymentsRouter.post('/vnpay', accessTokenValidator, wrapAsync(createPaymentUrlController))
paymentsRouter.get('/payments_return', wrapAsync(paymentReturn))

export default paymentsRouter
