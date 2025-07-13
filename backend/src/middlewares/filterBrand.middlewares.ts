import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { FilterBrandState } from '~/constants/enums'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

const activeBrandStates = [
  FilterBrandState.ACTIVE,
  FilterBrandState.COLLABORATION,
  FilterBrandState.PARTNERSHIP,
  FilterBrandState.EXCLUSIVE,
  FilterBrandState.LIMITED_EDITION
]

export const updateFilterBrandValidator = validate(
  checkSchema({
    _id: {
      in: ['params'],
      isMongoId: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_ID_IS_INVALID
      },
      custom: {
        options: async (value) => {
          const brand = await databaseService.filterBrand.findOne({ _id: new ObjectId(value) })
          if (!brand) {
            throw new ErrorWithStatus({ message: ADMIN_MESSAGES.FILTER_BRAND_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
          }
          if (
            brand.state === FilterBrandState.INACTIVE ||
            brand.state === FilterBrandState.SUSPENDED ||
            brand.state === FilterBrandState.DISCONTINUED
          ) {
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
      isString: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_OPTION_NAME_MUST_BE_A_STRING
      },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const existingBrand = await databaseService.filterBrand.findOne({
            _id: { $ne: new ObjectId(req.params?._id) },
            option_name: value,
            state: { $in: activeBrandStates }
          })
          if (existingBrand) {
            throw new Error(ADMIN_MESSAGES.FILTER_OPTION_NAME_ALREADY_EXISTS.replace('{value}', value))
          }
          return true
        }
      }
    },
    category_name: {
      optional: true,
      isString: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_CATEGORY_NAME_MUST_BE_A_STRING
      },
      trim: true
    },
    category_param: {
      optional: true,
      isString: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_CATEGORY_PARAM_MUST_BE_A_STRING
      },
      trim: true
    }
  })
)

export const disableFilterBrandValidator = validate(
  checkSchema({
    _id: {
      in: ['params'],
      isMongoId: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_ID_IS_INVALID
      }
    },
    state: {
      in: ['body'],
      isIn: {
        options: [Object.values(FilterBrandState)],
        // errorMessage: ADMIN_MESSAGES.STATE_MUST_BE_ONE_OF_THE_FILTER_BRAND_STATE
        errorMessage: `Trạng thái phải là một trong các giá trị: ${Object.values(FilterBrandState).join(', ')}`
      }
    }
  })
)

export const getFilterBrandByIdValidator = validate(
  checkSchema({
    _id: {
      in: ['params'],
      isMongoId: {
        errorMessage: ADMIN_MESSAGES.FILTER_BRAND_ID_IS_INVALID
      }
    }
  })
)
