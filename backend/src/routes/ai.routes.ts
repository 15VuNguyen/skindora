import { Router } from 'express'
import { skincareAdviceController, chatStreamController } from '~/controllers/ai.controllers'
import { skincareAdviceValidator } from '~/middlewares/skincare.middlewares'
import aiUsageService from '~/services/aiUsage.services'

const aiRouter = Router()

aiRouter.use(async (req, res, next) => {
  try {
    await aiUsageService.incrementUsage()
    next()
  } catch (error) {
    console.error('Error tracking AI usage:', error)
    next()
  }
})

aiRouter.post('/skincare-advice', skincareAdviceValidator, skincareAdviceController)
aiRouter.post('/chat/stream', chatStreamController)

export { aiRouter }
