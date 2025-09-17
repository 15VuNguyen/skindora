import { ObjectId } from 'mongodb'
import { ProductState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation' 
import { checkSchema } from 'express-validator'

export const validateProductExists = async (productId: string) => {
  if (!ObjectId.isValid(productId)) {
    throw new ErrorWithStatus({
      message: PRODUCTS_MESSAGES.INVALID_PRODUCT_ID,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  const product = await databaseService.products.findOne({ _id: new ObjectId(productId) })
  if (!product) {
    throw new ErrorWithStatus({
      message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', productId),
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  if (product.state !== ProductState.ACTIVE) {
    throw new ErrorWithStatus({
      message: PRODUCTS_MESSAGES.NOT_ACTIVE,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  return product
}
export const getProductsByIdsValidator = validate(
  checkSchema(
    {
      ids: {
        in: ['query'],
        notEmpty: {
          errorMessage: 'Product IDs are required.'
        },
        isString: {
          errorMessage: 'Product IDs must be a comma-separated string.'
        },
        custom: {
          options: (value: string, { req }) => {
            const ids = value.split(',')

            if (ids.length === 0) {
              throw new Error('At least one product ID is required.')
            }

            const invalidIds = ids.filter((id) => !ObjectId.isValid(id.trim()))
            if (invalidIds.length > 0) {
              throw new Error(`${PRODUCTS_MESSAGES.INVALID_PRODUCT_ID}. Invalid IDs found: ${invalidIds.join(', ')}`)
            }

            req.product_ids = ids.map((id) => new ObjectId(id.trim()))
            return true
          }
        }
      }
    },
    ['query']
  )
)
