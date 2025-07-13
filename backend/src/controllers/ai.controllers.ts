import { Request, Response, NextFunction } from 'express'
import { SkincareAdvisorRequestBody } from '~/models/requests/Ai.requests'
import skincareAdvisorService from '~/services/ai.services'
import { wrapAsync } from '~/utils/handler'

export const skincareAdviceController = wrapAsync(
  async (req: Request<unknown, unknown, SkincareAdvisorRequestBody>, res: Response, next: NextFunction) => {
    const result = await skincareAdvisorService.generateRoutine(req.body)
    
    if (result.info) {
      res.status(200).json({ message: result.info })
      return
    }
    
    res.status(200).json(result)
  }
)