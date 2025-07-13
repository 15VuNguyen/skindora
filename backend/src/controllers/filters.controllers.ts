import { Request, Response, NextFunction } from 'express'
import filterService from '~/services/filters.services'
import { wrapAsync } from '~/utils/handler'

export const getFilterOptionsController = wrapAsync(async (req: Request, res: Response, next: NextFunction) => {
  const options = await filterService.getAllFilterOptions()
  res.json(options)
})