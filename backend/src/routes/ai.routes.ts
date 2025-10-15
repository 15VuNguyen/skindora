import { Router } from 'express'
import {
  skincareAdviceController,
  chatStreamController,
  aiFeedbackController,
  aiFeedbackSummaryController
} from '~/controllers/ai.controllers'
import { skincareAdviceValidator, aiFeedbackValidator } from '~/middlewares/skincare.middlewares'
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
aiRouter.get('/feedback', aiFeedbackSummaryController)
aiRouter.post('/feedback', aiFeedbackValidator, aiFeedbackController)

export { aiRouter }
