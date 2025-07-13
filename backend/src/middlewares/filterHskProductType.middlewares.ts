import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { GenericFilterState } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'

export const createNewFilterHskProductTypeValidator = validate(
  checkSchema(
    {
      option_name: {
        notEmpty: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_OPTION_NAME_IS_REQUIRED },
        isString: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_OPTION_NAME_MUST_BE_STRING },
        trim: true,
        custom: {
          options: async (value) => {
            const existing = await databaseService.filterHskProductType.findOne({
              option_name: value,
              state: GenericFilterState.ACTIVE
            })
            if (existing) {
              throw new Error(ADMIN_MESSAGES.FILTER_OPTION_NAME_ALREADY_EXISTS.replace('{value}', value))
            }
            return true
          }
        }
      },
      description: {
        optional: true,
        isString: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_DESCRIPTION_MUST_BE_STRING },
        trim: true
      },
      category_name: {
        notEmpty: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_CATEGORY_NAME_IS_REQUIRED },
        isString: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_CATEGORY_NAME_MUST_BE_STRING },
        trim: true
      },
      category_param: {
        notEmpty: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_CATEGORY_PARAM_IS_REQUIRED },
        isString: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_CATEGORY_PARAM_MUST_BE_STRING },
        trim: true
      },
      state: {
        optional: true,
        isString: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_STATE_MUST_BE_A_STRING },
        isIn: {
          options: [Object.values(GenericFilterState)],
          errorMessage: `Trạng thái phải là một trong các giá trị: ${Object.values(GenericFilterState).join(', ')}`
        }
      }
    },
    ['body']
  )
)

export const updateFilterHskProductTypeValidator = validate(
  checkSchema({
    _id: {
      in: ['params'],
      isMongoId: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_ID_IS_INVALID },
      custom: {
        options: async (value) => {
          const productType = await databaseService.filterHskProductType.findOne({ _id: new ObjectId(value) })
          if (!productType) {
            throw new ErrorWithStatus({
              message: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }
          if (productType.state === GenericFilterState.INACTIVE) {
            throw new ErrorWithStatus({
              message: ADMIN_MESSAGES.FILTER_IS_INACTIVE_CANNOT_UPDATE,
              status: HTTP_STATUS.BAD_REQUEST
            })
          }
          return true
        }
      }
    },
    option_name: {
      optional: true,
      isString: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_OPTION_NAME_MUST_BE_STRING },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const existing = await databaseService.filterHskProductType.findOne({
            _id: { $ne: new ObjectId(req.params?._id) },
            option_name: value,
            state: GenericFilterState.ACTIVE
          })
          if (existing) {
            throw new Error(ADMIN_MESSAGES.FILTER_OPTION_NAME_ALREADY_EXISTS.replace('{value}', value))
          }
          return true
        }
      }
    },
    description: {
      optional: true,
      isString: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_DESCRIPTION_MUST_BE_STRING },
      trim: true
    },
    category_name: {
      optional: true,
      isString: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_CATEGORY_NAME_MUST_BE_STRING },
      trim: true
    },
    category_param: {
      optional: true,
      isString: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_CATEGORY_PARAM_MUST_BE_STRING },
      trim: true
    }
  })
)

export const disableFilterHskProductTypeValidator = validate(
  checkSchema({
    _id: { in: ['params'], isMongoId: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_ID_IS_INVALID } },
    state: {
      in: ['body'],
      isIn: {
        options: [Object.values(GenericFilterState)],
        errorMessage: `Trạng thái phải là một trong các giá trị: ${Object.values(GenericFilterState).join(', ')}`
      }
    }
  })
)

export const getFilterHskProductTypeByIdValidator = validate(
  checkSchema(
    {
      _id: {
        in: ['params'],
        isMongoId: { errorMessage: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_ID_IS_INVALID },
        custom: {
          options: async (value) => {
            const productType = await databaseService.filterHskProductType.findOne({ _id: new ObjectId(value) })
            if (!productType) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_ID_IS_INVALID,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
