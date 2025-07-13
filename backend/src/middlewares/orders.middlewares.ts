import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import {
  CART_MESSAGES,
  ORDER_MESSAGES,
  PRODUCTS_MESSAGES,
  USERS_MESSAGES,
  VOUCHER_MESSAGES
} from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import {
  CancelRequestStatus,
  DiscountType,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  ProductState,
  Role
} from '~/constants/enums'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import { canRoleTransition, canTransition, getNextOrderStatus } from '~/utils/orderStatus'
import { format } from 'util'
import { validateProductExists } from './products.middlewares'
import { NextFunction, Request, Response } from 'express'
import cartService from '~/services/cart.services'
import { Cart } from '~/models/requests/Cart.requests'
import Product from '~/models/schemas/Product.schema'
import { OrderReqBody, PendingOrder } from '~/models/requests/Orders.requests'
import { VoucherType } from '~/models/schemas/Voucher.schema'
import redisClient from '~/services/redis.services'
import { getBaseRequiredDate } from '~/utils/date'

export const checkOutValidator = validate(
  checkSchema(
    {
      RecipientName:{
        optional: true,
        trim: true
      },
      PhoneNumber:{
        optional: true,
        isMobilePhone:{
          options: ["vi-VN"],
          errorMessage: ORDER_MESSAGES.INVALID_PHONE_NUMBER,
        }
      },
      ShipAddress: {
        notEmpty: {
          errorMessage: ORDER_MESSAGES.SHIP_ADDRESS_REQUIRED
        },
        isString: {
          errorMessage: ORDER_MESSAGES.SHIP_ADDRESS_MUST_BE_STRING
        }
      },
      RequireDate: {
        optional: true,
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
      PaymentMethod: {
        optional: true,
        isIn: {
          options: [[PaymentMethod.COD, PaymentMethod.VNPAY, PaymentMethod.ZALOPAY]],
          errorMessage: ORDER_MESSAGES.INVALID_PAYMENT_METHOD
        }
      },
      voucherCode: {
        optional: true,
        custom: {
          options: async (value, { req }) => {
            const voucher = await databaseService.vouchers.findOne({ code: value })
            if (!voucher) {
              throw new ErrorWithStatus({
                message: VOUCHER_MESSAGES.NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            if (!voucher.isActive) {
              throw new ErrorWithStatus({
                message: VOUCHER_MESSAGES.NOT_ACTIVE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            if (voucher.endDate < new Date()) {
              throw new ErrorWithStatus({
                message: VOUCHER_MESSAGES.EXPIRED,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            if (voucher.usedCount >= voucher.usageLimit) {
              throw new ErrorWithStatus({
                message: VOUCHER_MESSAGES.REACH_LIMIT_USED,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            const { user_id } = req.decoded_authorization as TokenPayLoad
            const orderWithVoucherCount = await databaseService.orders
              .find({
                UserID: new ObjectId(user_id),
                'VoucherSnapshot.code': voucher.code
              })
              .toArray()

            if (orderWithVoucherCount.length >= voucher.userUsageLimit) {
              throw new ErrorWithStatus({
                message: VOUCHER_MESSAGES.USE_ONLY_ONCE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            req.voucher = voucher
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
        options: async (value) => {
          await validateProductExists(value)
          return true
        }
      }
    }
  })
)

export const buyNowValidator = validate(
  checkSchema(
    {
      productId: {
        notEmpty: {
          errorMessage: CART_MESSAGES.PRODUCT_ID_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const product = await validateProductExists(value)
            req.product = product
            return true
          }
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: CART_MESSAGES.QUANTITY_IS_REQUIRED
        }
      }
    },
    ['body']
  )
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
              message: ORDER_MESSAGES.NOT_FOUND.replace('%s', value),
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

export const getAllCancelledOrdersValidator = validate(
  checkSchema({
    status: {
      in: ['query'],
      optional: true,
      custom: {
        options: (value) => {
          if (!Object.values(CancelRequestStatus).includes(value)) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.INVALID_CANCELLED_STATUS,
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
              message: ORDER_MESSAGES.NOT_FOUND.replace('%s', value),
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          if (!order.Status) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.INVALID_ORDER_STATUS,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }

          if (order.CancelRequest && order.CancelRequest.status === CancelRequestStatus.REQUESTED) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.CANCEL_REQUESTING,
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

export const requestCancelOrderValidator = validate(
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
              message: ORDER_MESSAGES.NOT_FOUND.replace('%s', value),
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          if (!order.Status) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.INVALID_ORDER_STATUS,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }

          if (!canTransition(order.Status, OrderStatus.CANCELLED)) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.VALID_STATUS_CAN_CANCEL,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          req.order = order
          return true
        }
      }
    },
    reason: {
      in: ['body'],
      notEmpty: {
        errorMessage: ORDER_MESSAGES.REQUIRE_REASON
      }
    }
  })
)

export const cancelledOrderRequestedValidator = validate(
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
              message: ORDER_MESSAGES.NOT_FOUND.replace('%s', value),
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          if (!order.Status) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.INVALID_ORDER_STATUS,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }

          if (order.Status === OrderStatus.CANCELLED) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.ORDER_CANCELLED,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }

          if (
            !order.CancelRequest ||
            !order.CancelRequest.status ||
            order.CancelRequest.status !== CancelRequestStatus.REQUESTED
          ) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.NO_CANCELATION_REQUESTED,
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

export const cancelOrderValidator = validate(
  checkSchema({
    reason: {
      in: ['body'],
      notEmpty: {
        errorMessage: ORDER_MESSAGES.REQUIRE_REASON
      }
    },
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
              message: ORDER_MESSAGES.NOT_FOUND.replace('%s', value),
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          if (!order.Status) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.INVALID_ORDER_STATUS,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }

          const canCancel = canRoleTransition(Role.Admin || Role.Staff, order.Status, OrderStatus.CANCELLED)
          if (!canCancel) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.UNABLE_TO_CANCEL,
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

const idFields = [
  'filter_brand',
  'filter_dac_tinh',
  'filter_hsk_ingredients',
  'filter_hsk_product_type',
  'filter_hsk_size',
  'filter_hsk_skin_type',
  'filter_hsk_uses',
  'filter_origin'
]

const idFieldSchema = idFields.reduce(
  (schema, fieldName) => {
    schema[fieldName] = {
      optional: true,
      custom: {
        options: (value: string) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              message: ORDER_MESSAGES.INVALID_FILTER_ID,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    }
    return schema
  },
  {} as Record<string, any>
)

export const getOrderRevenueValidator = validate(
  checkSchema(
    {
      ...idFieldSchema,
      date: {
        optional: true,
        isISO8601: {
          errorMessage: ORDER_MESSAGES.INVALID_DATE
        },
        custom: {
          options: (value) => {
            if (new Date(value) > new Date()) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.NOT_ALLOW_FUTURE_DATE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      from: {
        optional: true,
        isISO8601: {
          errorMessage: ORDER_MESSAGES.INVALID_DATE
        },
        custom: {
          options: (value, { req }) => {
            if (value && !req.query?.to) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.REQUIRE_TO_DATE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            if (new Date(value) > new Date()) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.NOT_ALLOW_FUTURE_DATE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            if (new Date(value) > new Date(req.query?.toDate)) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.INVALID_FROM_DATE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      to: {
        optional: true,
        isISO8601: {
          errorMessage: ORDER_MESSAGES.INVALID_DATE
        },
        custom: {
          options: (value, { req }) => {
            if (value && !req.query?.from) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.REQUIRE_FROM_DATE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            if (new Date(value) > new Date()) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.NOT_ALLOW_FUTURE_DATE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            return true
          }
        }
      }
    },
    ['query']
  )
)

export const productInStockValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.decoded_authorization as TokenPayLoad
    if (!user_id || typeof user_id !== 'string') {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const cartKey = cartService.getCartKey(user_id)
    const cart: Cart = await cartService.getCart(cartKey)
    if (!cart) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (!cart.Products || cart.Products.length <= 0) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.EMPTY_OR_EXPIRED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const productIds = cart.Products?.map((p) => new ObjectId(p.ProductID))
    const products = await databaseService.products.find({ _id: { $in: productIds } }).toArray()
    const productMapping = new Map<string, Product>(products.map((p) => [p._id.toString(), p]))

    cart.Products?.map((p) => {
      const product = productMapping.get(p.ProductID)
      if (!product) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', p.ProductID),
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      if (product.state !== ProductState.ACTIVE) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.NOT_ACTIVE,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }

      if (Number.isNaN(product.quantity) || (product.quantity ?? 0) < p.Quantity) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.NOT_ENOUGHT.replace('%s', (product.quantity ?? 0).toString()),
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
    })
    req.products = products
    req.cart = cart
    next()
  } catch (error) {
    let status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
    let message = 'Internal Server Error'

    if (error instanceof ErrorWithStatus) {
      status = error.status
      message = error.message
    } else if (error instanceof Error) {
      message = error.message
    }
    res.status(status).json({ message })
  }
}

export const savePendingOrderToRedis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.decoded_authorization as TokenPayLoad
    const cart = req.cart as Cart
    const products = req.products as Array<Product>
    const voucher = req.voucher as VoucherType
    const { ShipAddress, Description, RequireDate, PaymentMethod: method } = req.body as OrderReqBody
    let finalPrice = 0
    const pendingOrderId = new ObjectId()

    const pendingOrder: PendingOrder = {
      UserID: new ObjectId(user_id),
      Details: products.map((product) => {
        const unitPrice = parseFloat(product.price_on_list ?? '0')
        const quantity = cart.Products.find((p) => p.ProductID === product._id?.toString())?.Quantity ?? 0
        const totalPrice = unitPrice * quantity
        finalPrice += totalPrice

        return {
          ProductID: product._id,
          OrderID: pendingOrderId,
          Quantity: quantity.toString(),
          UnitPrice: unitPrice.toString()
        }
      }),
      ShipAddress,
      Description,
      RequireDate: RequireDate ?? getBaseRequiredDate().toISOString(),
      PaymentMethod: method ?? PaymentMethod.COD,
      PaymentStatus: PaymentStatus.UNPAID,
      TotalPrice: finalPrice.toString()
    }

    let discount = 0
    if (voucher) {
      const maxDiscountAmount = isNaN(Number(voucher.maxDiscountAmount)) ? 0 : Number(voucher.maxDiscountAmount)
      let percentDiscountValue = (voucher.discountValue / 100) * finalPrice
      percentDiscountValue = Math.min(maxDiscountAmount, percentDiscountValue)
      discount = voucher.discountType === DiscountType.Percentage ? percentDiscountValue : voucher.discountValue

      pendingOrder.DiscountValue = discount.toString()
      pendingOrder.VoucherSnapshot = {
        code: voucher.code,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscountAmount: voucher.maxDiscountAmount
      }
    }
    if (discount > 0) {
      finalPrice -= discount
      pendingOrder.TotalPrice = finalPrice.toString()
    }

    await redisClient.setEx(
      `${process.env.PENDING_ORDER_KEY}${pendingOrderId.toString()}`,
      30 * 60,
      JSON.stringify(pendingOrder)
    )
    req.redis_order_id = pendingOrderId
    next()
  } catch (error) {
    let status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
    let message = 'Internal Server Error'

    if (error instanceof ErrorWithStatus) {
      status = error.status
      message = error.message
    } else if (error instanceof Error) {
      message = error.message
    }
    res.status(status).json({ message })
  }
}
