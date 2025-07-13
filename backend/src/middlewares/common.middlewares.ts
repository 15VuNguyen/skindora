import { Response, Request, NextFunction } from 'express'
import { pick } from 'lodash'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { ADMIN_MESSAGES, COMMON_MESSAGES } from '~/constants/messages'

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

const MAX_PAGE_LIMIT = 50
const MAX_ITEMS_PER_PAGE = 20
export const paginationValidator = validate(
  checkSchema({
    page: {
      in: ['query'],
      optional: true,
      isInt: {
        options: {
          min: 1,
          max: MAX_PAGE_LIMIT
        },
        errorMessage: `${COMMON_MESSAGES.PAGE_MUST_BE_INTEGER_BETWEEN} 1 and ${MAX_PAGE_LIMIT}`
      },
      toInt: true
    },
    limit: {
      in: ['query'],
      optional: true,
      isInt: {
        options: {
          min: 1,
          max: MAX_ITEMS_PER_PAGE
        },
        errorMessage: `${COMMON_MESSAGES.LIMIT_MUST_BE_INTEGER_BETWEEN}: 1 and ${MAX_ITEMS_PER_PAGE}`
      },
      toInt: true
    }
  })
)

export const searchFilterOptionNameValidator = validate(
  checkSchema({
    keyword: {
      in: ['query'],
      optional: true,
      isString: {
        errorMessage: ADMIN_MESSAGES.OPTION_NAME_SEARCH_MUST_BE_STRING
      },
      trim: true
    }
  })
)