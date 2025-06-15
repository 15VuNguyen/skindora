import { Response, Request, NextFunction } from 'express'
import { pick } from 'lodash'
type FilterKeys<T> = Array<keyof T>

export const filterMiddleware =
  <T>(filterKey: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKey)
    next()
  }

export const parseDateFieldsMiddleware = (fields: string[]) => (req: Request, res: Response, next: NextFunction) => {
  fields.forEach((field) => {
    if (req.body[field]) {
      req.body[field] = new Date(req.body[field])
    }
  })
  next()
}
