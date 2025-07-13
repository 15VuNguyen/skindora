import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import { GenericFilterState } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'

export const createNewFilterHskSizeValidator = validate(
  checkSchema(
    {
      option_name: {
        notEmpty: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_OPTION_NAME_IS_REQUIRED },
        isString: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_OPTION_NAME_MUST_BE_STRING },
        trim: true,
        custom: {
          options: async (value) => {
            const existing = await databaseService.filterHskSize.findOne({
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
      category_name: {
        notEmpty: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_CATEGORY_NAME_IS_REQUIRED },
        isString: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_CATEGORY_NAME_MUST_BE_STRING },
        trim: true
      },
      category_param: {
        notEmpty: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_CATEGORY_PARAM_IS_REQUIRED },
        isString: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_CATEGORY_PARAM_MUST_BE_STRING },
        trim: true
      },
      state: {
        optional: true,
        isString: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_STATE_MUST_BE_A_STRING },
        isIn: {
          options: [Object.values(GenericFilterState)],
          errorMessage: `Trạng thái phải là một trong các giá trị: ${Object.values(GenericFilterState).join(', ')}`
        }
      }
    },
    ['body']
  )
)

export const updateFilterHskSizeValidator = validate(
  checkSchema({
    _id: {
      in: ['params'],
      isMongoId: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_ID_IS_INVALID },
      custom: {
        options: async (value) => {
          const size = await databaseService.filterHskSize.findOne({ _id: new ObjectId(value) })
          if (!size) {
            throw new ErrorWithStatus({ message: ADMIN_MESSAGES.FILTER_SIZE_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
          }
          if (size.state === GenericFilterState.INACTIVE) {
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
      isString: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_OPTION_NAME_MUST_BE_STRING },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const existing = await databaseService.filterHskSize.findOne({
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
    category_name: {
      optional: true,
      isString: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_CATEGORY_NAME_MUST_BE_STRING },
      trim: true
    },
    category_param: {
      optional: true,
      isString: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_CATEGORY_PARAM_MUST_BE_STRING },
      trim: true
    }
  })
)

export const disableFilterHskSizeValidator = validate(
  checkSchema({
    _id: { in: ['params'], isMongoId: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_ID_IS_INVALID } },
    state: {
      in: ['body'],
      isIn: {
        options: [Object.values(GenericFilterState)],
        errorMessage: `Trạng thái phải là một trong các giá trị: ${Object.values(GenericFilterState).join(', ')}`
      }
    }
  })
)

export const getFilterHskSizeByIdValidator = validate(
  checkSchema(
    {
      _id: {
        in: ['params'],
        isMongoId: { errorMessage: ADMIN_MESSAGES.FILTER_SIZE_ID_IS_INVALID },
        custom: {
          options: async (value) => {
            const size = await databaseService.filterHskSize.findOne({ _id: new ObjectId(value) })
            if (!size) {
              throw new ErrorWithStatus({
                message: ADMIN_MESSAGES.FILTER_SIZE_NOT_FOUND,
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
