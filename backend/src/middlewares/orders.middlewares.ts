import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { CART_MESSAGES, ORDER_MESSAGES, PRODUCTS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { OrderStatus, OrderType, Role } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import { canRoleTransition, getNextOrderStatus } from '~/utils/orderStatus'
import { format } from 'util'

export const checkOutValidator = validate(
  checkSchema(
    {
      ShipAddress: {
        notEmpty: {
          errorMessage: ORDER_MESSAGES.SHIP_ADDRESS_REQUIRED
        },
        isString: {
          errorMessage: ORDER_MESSAGES.SHIP_ADDRESS_MUST_BE_STRING
        }
      },
      RequireDate: {
        notEmpty: {
          errorMessage: ORDER_MESSAGES.REQUIRE_DATE_REQUIRED
        },
        isISO8601: {
          errorMessage: ORDER_MESSAGES.INVALID_REQUIRE_DATE
        },
        custom: {
          options: (value) => {
            const requiredDate = new Date(value)
            const now = new Date()
            if (requiredDate < now) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.PRESENT_REQUIRE_DATE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      Discount:{
        optional: true,
        custom:{
          options: (value)=>{
            if(Number(value) < 0 || Number(value) > 100){
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.INVALID_DISCOUNT_VALUE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      type: {
        optional: true,
        isIn: {
          options: [[OrderType.CART, OrderType.BUY_NOW]],
          errorMessage: ORDER_MESSAGES.INVALID_CHECKOUT_TYPE
        }
      }
    },
    ['body']
  )
)

export const prepareOrderValidator = validate(
  checkSchema({
    selectedProductIDs: {
      in: ['body'],
      isArray: {
        errorMessage: PRODUCTS_MESSAGES.PRODUCT_IDS_MUST_BE_ARRAY
      },
      notEmpty: {
        errorMessage: CART_MESSAGES.NOT_SELECTED
      }
    },
    'selectedProductIDs.*': {
      custom: {
        options: (value) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              message: CART_MESSAGES.INVALID_PRODUCT_ID,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    }
  })
)

export const getAllOrdersByUserIdValidator = validate(
  checkSchema({
    userId: {
      in: ['params'],
      notEmpty: {
        errorMessage: ORDER_MESSAGES.REQUIRE_USER_ID
      },
      isMongoId: {
        errorMessage: USERS_MESSAGES.INVALID_USER_ID
      },
      custom: {
        options: async (value) => {
          const user = await databaseService.users.findOne({ _id: new ObjectId(value) })
          if (!user) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.USER_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          return true
        }
      }
    }
  })
)

export const getOrderByIdValidator = validate(
  checkSchema({
    orderId: {
      in: ['params'],
      notEmpty: {
        errorMessage: ORDER_MESSAGES.REQUIRE_ORDER_ID
      },
      isMongoId: {
        errorMessage: ORDER_MESSAGES.INVALID_ORDER_ID
      },
      custom: {
        options: async (value, { req }) => {
          const { user_id } = req.decoded_authorization as TokenPayLoad

          const user = await databaseService.users.findOne({
            _id: new ObjectId(user_id)
          })

          if (user === null) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.USER_NOT_FOUND,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          req.user = user

          const order = await databaseService.orders.findOne({ _id: new ObjectId(value) })

          if (!order) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          req.order = order
          return true
        }
      }
    }
  })
)

export const getAllOrdersValidator = validate(
  checkSchema({
    status: {
      in: ['query'],
      optional: true,
      custom: {
        options: (value) => {
          if (!Object.values(OrderStatus).includes(value)) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.INVALID_ORDER_STATUS,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    }
  })
)

export const getNextOrderStatusValidator = validate(
  checkSchema({
    orderId: {
      in: ['params'],
      notEmpty: {
        errorMessage: ORDER_MESSAGES.REQUIRE_ORDER_ID
      },
      isMongoId: {
        errorMessage: ORDER_MESSAGES.INVALID_ORDER_ID
      },
      custom: {
        options: async (value, { req }) => {
          const order = await databaseService.orders.findOne({ _id: new ObjectId(value) })

          if (!order) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          if (!order.Status) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.INVALID_ORDER_STATUS,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }

          if (order.Status === OrderStatus.RETURNED || order.Status === OrderStatus.CANCELLED) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.CANNOT_UPDATE_STATUS.replace('%s', order.Status),
              status: HTTP_STATUS.BAD_REQUEST
            })
          }

          const nextStatus = getNextOrderStatus(order.Status)
          if (!canRoleTransition(Role.Staff, order.Status, nextStatus!)) {
            throw new ErrorWithStatus({
              message: format(ORDER_MESSAGES.UPDATE_TO_NEXT_STATUS_FAIL, order.Status, nextStatus),
              status: HTTP_STATUS.BAD_REQUEST
            })
          }

          req.order = order
          return true
        }
      }
    }
  })
)
