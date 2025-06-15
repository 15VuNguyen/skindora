import { checkSchema } from 'express-validator'
import _ from 'lodash'
import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { REVIEW_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const addNewReviewValidator = validate(
  checkSchema({
    orderId: {
      in: 'params',
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.ORDER_ID_IS_REQUIRED
      },
      isString: {
        errorMessage: REVIEW_MESSAGES.ORDER_ID_MUST_A_STRING
      },
      trim: true,
      custom: {
        options: async (value) => {
          const order = await databaseService.orders.findOne({
            _id: new ObjectId(value)
          })
          if (!order) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.INVALID_ORDER_ID
            })
          }
        }
      }
    },
    productId: {
      in: 'params',
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.PRODUCT_ID_IS_REQUIRED
      },
      isString: {
        errorMessage: REVIEW_MESSAGES.PRODUCT_ID_MUST_A_STRING
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const product = await databaseService.products.findOne({ _id: new ObjectId(value) })

          if (!product) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND
            })
          }

          const { user_id } = req.decoded_authorization as TokenPayLoad
          const order = await databaseService.orders.findOne({
            _id: new ObjectId(req.params?.orderId),
            UserID: new ObjectId(user_id)
          })
          if (!order) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.INVALID_ORDER_ID
            })
          }
          if (order.Status !== OrderStatus.DELIVERED) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.FORBIDDEN,
              message: REVIEW_MESSAGES.STATUS_INVALID
            })
          }
          if (order.ShippedDate) {
            const shippedDate = new Date(order.ShippedDate).getTime()
            const sevenDaysLater = _.now() + 7 * 24 * 60 * 60 * 1000

            if (shippedDate > sevenDaysLater) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: REVIEW_MESSAGES.EXPIRED_REVIEW
              })
            }
          }

          const orderDetails = await databaseService.orderDetails.findOne({
            OrderID: new ObjectId(req.params?.orderId),
            ProductID: new ObjectId(req.params?.productId)
          })
          if (!orderDetails) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.INVALID_ORDER_ID
            })
          }

          const isExistFeedBack = await databaseService.reviews.findOne({
            orderID: new ObjectId(req.params?.orderId),
            productID: new ObjectId(req.params?.productId),
            isDeleted: false
          })
          if (isExistFeedBack) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.FORBIDDEN,
              message: REVIEW_MESSAGES.REVIEW_EXISTED
            })
          }
        }
      }
    },
    rating: {
      in: 'body',
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.RATING_IS_REQUIRED
      },
      isInt: {
        options: { min: 1, max: 5 },
        errorMessage: REVIEW_MESSAGES.RATING_INVALID
      },
      toInt: true
    },
    comment: {
      in: 'body',
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.COMMENT_IS_REQUIRED
      },
      isString: {
        errorMessage: REVIEW_MESSAGES.COMMENT_MUST_A_STRING
      }
    }
  })
)

export const updateReviewValidator = validate(
  checkSchema({
    orderId: {
      in: 'params',
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.ORDER_ID_IS_REQUIRED
      },
      isString: {
        errorMessage: REVIEW_MESSAGES.ORDER_ID_MUST_A_STRING
      },
      trim: true,
      custom: {
        options: async (value) => {
          const order = await databaseService.orders.findOne({
            _id: new ObjectId(value)
          })
          if (!order) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.INVALID_ORDER_ID
            })
          }
        }
      }
    },
    productId: {
      in: 'params',
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.PRODUCT_ID_IS_REQUIRED
      },
      isString: {
        errorMessage: REVIEW_MESSAGES.PRODUCT_ID_MUST_A_STRING
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const product = await databaseService.products.findOne({ _id: new ObjectId(value) })

          if (!product) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND
            })
          }

          const { user_id } = req.decoded_authorization as TokenPayLoad
          const order = await databaseService.orders.findOne({
            _id: new ObjectId(req.params?.orderId),
            UserID: new ObjectId(user_id)
          })
          if (!order) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.INVALID_ORDER_ID
            })
          }
          if (order.Status !== OrderStatus.DELIVERED) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.FORBIDDEN,
              message: REVIEW_MESSAGES.STATUS_INVALID
            })
          }
          if (order.ShippedDate) {
            const shippedDate = new Date(order.ShippedDate).getTime()
            const sevenDaysLater = _.now() + 7 * 24 * 60 * 60 * 1000

            if (shippedDate > sevenDaysLater) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: REVIEW_MESSAGES.EXPIRED_REVIEW
              })
            }
          }

          const orderDetails = await databaseService.orderDetails.findOne({
            OrderID: new ObjectId(req.params?.orderId),
            ProductID: new ObjectId(req.params?.productId)
          })
          if (!orderDetails) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.INVALID_ORDER_ID
            })
          }

          const prevFeedBack = await databaseService.reviews.findOne({
            orderID: new ObjectId(order._id.toString()),
            productID: new ObjectId(req.params?.productId),
            isDeleted: false
          })
          if (!prevFeedBack) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.REVIEW_NOT_FOUND
            })
          }
        }
      }
    },
    rating: {
      in: 'body',
      optional: true,
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.RATING_IS_REQUIRED
      },
      isInt: {
        options: { min: 1, max: 5 },
        errorMessage: REVIEW_MESSAGES.RATING_INVALID
      },
      toInt: true
    },
    comment: {
      in: 'body',
      optional: true,
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.COMMENT_IS_REQUIRED
      },
      isString: {
        errorMessage: REVIEW_MESSAGES.COMMENT_MUST_A_STRING
      }
    }
  })
)

export const removeReviewValidator = validate(
  checkSchema({
    orderId: {
      in: 'params',
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.ORDER_ID_IS_REQUIRED
      },
      isString: {
        errorMessage: REVIEW_MESSAGES.ORDER_ID_MUST_A_STRING
      },
      trim: true,
      custom: {
        options: async (value) => {
          const order = await databaseService.orders.findOne({
            _id: new ObjectId(value)
          })
          if (!order) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.INVALID_ORDER_ID
            })
          }
        }
      }
    },
    productId: {
      in: 'params',
      notEmpty: {
        errorMessage: REVIEW_MESSAGES.PRODUCT_ID_IS_REQUIRED
      },
      isString: {
        errorMessage: REVIEW_MESSAGES.PRODUCT_ID_MUST_A_STRING
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const product = await databaseService.products.findOne({ _id: new ObjectId(value) })

          if (!product) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND
            })
          }

          const { user_id } = req.decoded_authorization as TokenPayLoad
          const order = await databaseService.orders.findOne({
            _id: new ObjectId(req.params?.orderId),
            UserID: new ObjectId(user_id)
          })
          if (!order) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.INVALID_ORDER_ID
            })
          }
          if (order.Status !== OrderStatus.DELIVERED) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.FORBIDDEN,
              message: REVIEW_MESSAGES.STATUS_INVALID
            })
          }
          if (order.ShippedDate) {
            const shippedDate = new Date(order.ShippedDate).getTime()
            const sevenDaysLater = _.now() + 7 * 24 * 60 * 60 * 1000

            if (shippedDate > sevenDaysLater) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: REVIEW_MESSAGES.EXPIRED_REVIEW
              })
            }
          }

          const orderDetails = await databaseService.orderDetails.findOne({
            OrderID: new ObjectId(req.params?.orderId),
            ProductID: new ObjectId(req.params?.productId)
          })
          if (!orderDetails) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.INVALID_ORDER_ID
            })
          }

          const prevFeedBack = await databaseService.reviews.findOne({
            orderID: new ObjectId(order._id.toString()),
            productID: new ObjectId(req.params?.productId),
            isDeleted: false
          })
          if (!prevFeedBack) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: REVIEW_MESSAGES.REVIEW_NOT_FOUND
            })
          }
        }
      }
    }
  })
)
