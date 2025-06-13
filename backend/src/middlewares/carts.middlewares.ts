import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { CART_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { validate } from '~/utils/validation'
import { validateProductExists } from './products.middlewares'

export const addToCartValidator = validate(
  checkSchema(
    {
      ProductID: {
        notEmpty: {
          errorMessage: CART_MESSAGES.PRODUCT_ID_IS_REQUIRED
        },
        custom: {
          options: async (value: string, {req}) => {
            const product = await validateProductExists(value)

            if (!product.quantity || product.quantity <= 0) {
              throw new ErrorWithStatus({
                message: PRODUCTS_MESSAGES.OUT_OF_STOCK,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            req.product = product
            return true
          }
        }
      },
      Quantity: {
        notEmpty: {
          errorMessage: CART_MESSAGES.QUANTITY_IS_REQUIRED
        },
        isInt: {
          options: { gt: 0 },
          errorMessage: CART_MESSAGES.POSITIVE_INTEGER_QUANTITY
        }
      }
    },
    ['body']
  )
)

export const updateCartValidator = validate(
  checkSchema({
    productId: {
      in: ['params'],
      notEmpty: {
        errorMessage: CART_MESSAGES.PRODUCT_ID_IS_REQUIRED
      },
      custom: {
        //options: (value, meta: {req, location, path})
        options: async (value, { req }) => {
          const product = await validateProductExists(value)
          req.product = product
          return true
        }
      }
    },
    Quantity: {
      in: ['body'],
      isInt: {
        options: { min: 0 },
        errorMessage: CART_MESSAGES.NON_NEGATIVE_INTEGER_QUANTITY
      }
    }
  })
)

export const removeProductFromCartValidator = validate(
  checkSchema(
    {
      productId: {
        notEmpty: {
          errorMessage: CART_MESSAGES.PRODUCT_ID_IS_REQUIRED
        },
        custom: {
          options: async (value) => {
            await validateProductExists(value)
            return true
          }
        }
      }
    },
    ['params']
  )
)
