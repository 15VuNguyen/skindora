import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { DiscountType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'
import util from 'util'

const discountTypeValues = Object.values(DiscountType)
function formatMessage(template: string, values: string[]) {
  return template.replace('%s', values.join(', '))
}

export const createVoucherValidator = validate(
  checkSchema({
    code: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.CODE_IS_REQUIRED
      },
      isString: {
        errorMessage: ADMIN_MESSAGES.CODE_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 3,
          max: 10
        },
        errorMessage: ADMIN_MESSAGES.CODE_LENGTH_INVALID
      },
      matches: {
        options: [/^[a-zA-Z0-9]+$/],
        errorMessage: ADMIN_MESSAGES.CODE_INVALID_CHARACTERS
      },
      toUpperCase: true,
      trim: true
    },
    description: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.DESCRIPTION_IS_REQUIRED
      },
      isString: {
        errorMessage: ADMIN_MESSAGES.DESCRIPTION_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: ADMIN_MESSAGES.DESCRIPTION_LENGTH_INVALID
      },
      trim: true
    },
    discountType: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.DISCOUNT_TYPE_IS_REQUIRED
      },
      isIn: {
        options: [discountTypeValues],
        errorMessage: formatMessage(ADMIN_MESSAGES.DISCOUNT_TYPE_INVALID, discountTypeValues)
      }
    },
    discountValue: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.DISCOUNT_VALUE_IS_REQUIRED
      },
      custom: {
        options: (value, { req }) => {
          const type = req.body.discountType
          const num = parseInt(value, 10)

          if (isNaN(num)) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.DISCOUNT_VALUE_INVALID
            })
          }

          if (type === DiscountType.Percentage) {
            if (num <= 0 || num >= 100) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: ADMIN_MESSAGES.DISCOUNT_VALUE_PERCENTAGE
              })
            }
          } else if (type === DiscountType.Fixed) {
            if (num < 1000) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: ADMIN_MESSAGES.DISCOUNT_VALUE_GREATER_THAN_1000
              })
            }
          }
          return true
        }
      },
      trim: true
    },
    maxDiscountAmount: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.MAX_DISCOUNT_IS_REQUIRED
      },
      custom: {
        options: (value) => {
          const num = parseInt(value, 10)

          if (isNaN(num)) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.MAX_DISCOUNT_INVALID
            })
          }

          if (num < 1000) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.MAX_DISCOUNT_INVALID
            })
          }
          return true
        }
      },
      trim: true
    },
    minOrderValue: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.MIN_ORDER_IS_REQUIRED
      },
      isInt: {
        options: { min: 1000 },
        errorMessage: ADMIN_MESSAGES.MIN_ORDER_INVALID
      },
      trim: true
    },
    startDate: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.START_DATE_IS_REQUIRED
      },
      isISO8601: {
        errorMessage: ADMIN_MESSAGES.START_DATE_INVALID
      }
    },
    endDate: {
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.END_DATE_IS_REQUIRED
      },
      isISO8601: {
        errorMessage: ADMIN_MESSAGES.END_DATE_INVALID
      },
      custom: {
        options: (value, { req }) => {
          const start = new Date(req.body.startDate)
          const end = new Date(value)
          if (end <= start) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.END_DATE_BEFORE_START_DATE
            })
          }
          return true
        }
      }
    },
    usageLimit: {
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: ADMIN_MESSAGES.USAGE_LIMIT_MUST_BE_NUMBER
      }
    },
    userUsageLimit: {
      optional: true,
      isInt: {
        errorMessage: ADMIN_MESSAGES.USER_USAGE_LIMIT_MUST_BE_NUMBER
      }
    }
  })
)

export const updateVoucherValidator = validate(
  checkSchema({
    description: {
      optional: true,
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.DESCRIPTION_IS_REQUIRED
      },
      isString: {
        errorMessage: ADMIN_MESSAGES.DESCRIPTION_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: ADMIN_MESSAGES.DESCRIPTION_LENGTH_INVALID
      },
      trim: true
    },
    discountType: {
      optional: true,
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.DISCOUNT_TYPE_IS_REQUIRED
      },
      isIn: {
        options: [discountTypeValues],
        errorMessage: formatMessage(ADMIN_MESSAGES.DISCOUNT_TYPE_INVALID, discountTypeValues)
      }
    },
    discountValue: {
      optional: true,
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.DISCOUNT_VALUE_IS_REQUIRED
      },
      custom: {
        options: async (value, { req }) => {
          let type = req.body.discountType
          if (!type) {
            const voucher = await databaseService.vouchers.findOne({ _id: new ObjectId(req.params?.voucherId) })
            type = voucher?.discountType
          }
          const num = parseInt(value, 10)

          if (isNaN(num)) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.DISCOUNT_VALUE_INVALID
            })
          }

          if (type === DiscountType.Percentage) {
            if (num <= 0 || num >= 100) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: ADMIN_MESSAGES.DISCOUNT_VALUE_PERCENTAGE
              })
            }
          } else if (type === DiscountType.Fixed) {
            if (num < 1000) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: ADMIN_MESSAGES.DISCOUNT_VALUE_GREATER_THAN_1000
              })
            }
          }
          return true
        }
      },
      trim: true
    },
    maxDiscountAmount: {
      optional: true,
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.MAX_DISCOUNT_IS_REQUIRED
      },
      custom: {
        options: (value) => {
          const num = parseInt(value, 10)

          if (isNaN(num)) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.MAX_DISCOUNT_INVALID
            })
          }

          if (num < 1000) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.MAX_DISCOUNT_INVALID
            })
          }
          return true
        }
      },
      trim: true
    },
    minOrderValue: {
      optional: true,
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.MIN_ORDER_IS_REQUIRED
      },
      custom: {
        options: (value) => {
          const num = parseInt(value, 10)

          if (isNaN(num)) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.MIN_ORDER_INVALID
            })
          }

          if (num < 1000) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.MIN_ORDER_INVALID
            })
          }
          return true
        }
      },
      trim: true
    },
    endDate: {
      optional: true,
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.END_DATE_IS_REQUIRED
      },
      isISO8601: {
        errorMessage: ADMIN_MESSAGES.END_DATE_INVALID
      },
      custom: {
        options: async (value, { req }) => {
          const voucher = await databaseService.vouchers.findOne({ _id: new ObjectId(req.params?.voucherId) })
          const end = new Date(value)
          if (!voucher?.startDate) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: ADMIN_MESSAGES.START_DATE_NOT_FOUND
            })
          }
          if (end <= voucher.startDate) {
            throw new ErrorWithStatus({
              status: HTTP_STATUS.BAD_REQUEST,
              message: ADMIN_MESSAGES.END_DATE_BEFORE_START_DATE
            })
          }
          return true
        }
      }
    },
    usageLimit: {
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: ADMIN_MESSAGES.USAGE_LIMIT_MUST_BE_NUMBER
      }
    },
    userUsageLimit: {
      optional: true,
      isInt: {
        errorMessage: ADMIN_MESSAGES.USER_USAGE_LIMIT_MUST_BE_NUMBER
      }
    }
  })
)

export const voucherIdValidator = validate(
  checkSchema({
    voucherId: {
      in: 'params',
      notEmpty: {
        errorMessage: ADMIN_MESSAGES.VOUCHER_ID_IS_REQUIRED
      },
      custom: {
        options: async (value: string, { req }) => {
          const voucher = await databaseService.vouchers.findOne({ _id: new ObjectId(value.toString()) })
          if (!voucher) {
            const message = util.format(ADMIN_MESSAGES.VOUCHER_ID_NOT_FOUND, value)

            throw new ErrorWithStatus({
              status: HTTP_STATUS.NOT_FOUND,
              message: message
            })
          }
          req.voucher = voucher
          return true
        }
      },
      trim: true
    }
  })
)
