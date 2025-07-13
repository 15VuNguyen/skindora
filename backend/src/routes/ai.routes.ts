import { Router } from 'express'
import { skincareAdviceController } from '~/controllers/ai.controllers'
import { skincareAdviceValidator } from '~/middlewares/skincare.middlewares'

const aiRouter = Router()

aiRouter.post('/skincare-advice', skincareAdviceValidator, skincareAdviceController)

export { aiRouter }
