import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { Request, Response, NextFunction } from 'express'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import { ProductState, Role } from '~/constants/enums'
import { validate } from '~/utils/validation'
import { ParamSchema, checkSchema } from 'express-validator'
import filterBrandService from '~/services/filterBrand.services'
import filterDacTinhService from '~/services/filterDacTinh.services'
import filterHskIngredientService from '~/services/filterHskIngredient.services'
import filterHskProductTypeService from '~/services/filterHskProductType.services'
import filterHskSizeService from '~/services/filterHskSize.services'
import filterHskSkinTypeService from '~/services/filterHskSkinType.services'
import filterHskUsesService from '~/services/filterHskUses.services'
import filterOriginService from '~/services/filterOrigin.services'
import PRODUCT from '~/constants/product'

export const isAdminValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.decoded_authorization as TokenPayLoad
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (user === null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    if (user.roleid !== Role.Admin) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ACCESS_DENIED_ADMIN_ONLY,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
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

export const isAdminOrStaffValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.decoded_authorization as TokenPayLoad
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (user === null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    if (![Role.Admin, Role.Staff].includes(user.roleid)) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ACCESS_DENIED_ADMIN_OR_STAFF_ONLY,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
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

export const createNewProductValidator = validate(
  checkSchema(
    {
      name_on_list: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.NAME_ON_LIST_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.INVALID_PRODUCT_NAME_ON_LIST
        },
        trim: true
      },
      engName_on_list: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.ENGLISH_NAME_ON_LIST_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.INVALID_PRODUCT_ENG_NAME_ON_LIST
        },
        trim: true
      },
      price_on_list: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.PRICE_ON_LIST_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.PRICE_ON_LIST_MUST_A_STRING
        },
        trim: true
      },
      image_on_list: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.IMAGE_ON_LIST_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.IMAGE_ON_LIST_MUST_BE_A_STRING
        },
        trim: true,
        isURL: {
          errorMessage: ADMIN_MESSAGES.IMAGE_ON_LIST_URL_MUST_BE_VALID
        }
      },
      hover_image_on_list: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.HOVER_IMAGE_ON_LIST_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.HOVER_IMAGE_ON_LIST_MUST_BE_A_STRING
        },
        trim: true,
        isURL: {
          errorMessage: ADMIN_MESSAGES.HOVER_IMAGE_ON_LIST_URL_MUST_BE_VALID
        }
      },
      productName_detail: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.PRODUCT_NAME_DETAIL_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.PRODUCT_NAME_DETAIL_MUST_BE_A_STRING
        },
        trim: true
      },
      engName_detail: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.PRODUCT_ENGLIST_NAME_DETAIL_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.PRODUCT_ENGLIST_NAME_DETAIL_MUST_BE_A_STRING
        },
        trim: true
      },
      description_detail: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.DESCRIPTION_DETAIL_IS_REQUIRED
        },
        isObject: {
          errorMessage: ADMIN_MESSAGES.DESCRIPTION_DETAIL_MUST_BE_AN_OBJECT
        },
        trim: true
      },
      'description_detail.rawHtml': {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.DESCRIPTION_DETAIL_RAW_HTML_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.DESCRIPTION_DETAIL_RAW_HTML_MUST_BE_A_STRING
        },
        trim: true
      },
      'description_detail.plainText': {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.DESCRIPTION_DETAIL_PLAIN_TEXT_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.DESCRIPTION_DETAIL_PLAIN_TEXT_MUST_BE_A_STRING
        },
        trim: true
      },
      ingredients_detail: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.INGREDIENTS_DETAIL_IS_REQUIRED
        },
        isObject: {
          errorMessage: ADMIN_MESSAGES.INGREDIENTS_DETAIL_MUST_BE_AN_OBJECT
        },
        trim: true
      },
      'ingredients_detail.rawHtml': {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.INGREDIENTS_DETAIL_RAW_HTML_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.INGREDIENTS_DETAIL_RAW_HTML_MUST_BE_A_STRING
        },
        trim: true
      },
      'ingredients_detail.plainText': {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.INGREDIENTS_DETAIL_PLAIN_TEXT_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.INGREDIENTS_DETAIL_PLAIN_TEXT_MUST_BE_A_STRING
        },
        trim: true
      },
      guide_detail: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.GUIDE_DETAIL_IS_REQUIRED
        },
        isObject: {
          errorMessage: ADMIN_MESSAGES.GUIDE_DETAIL_MUST_BE_AN_OBJECT
        },
        trim: true
      },
      'guide_detail.rawHtml': {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.GUIDE_DETAIL_RAW_HTML_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.GUIDE_DETAIL_RAW_HTML_MUST_BE_A_STRING
        },
        trim: true
      },
      'guide_detail.plainText': {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.GUIDE_DETAIL_PLAIN_TEXT_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.GUIDE_DETAIL_PLAIN_TEXT_MUST_BE_A_STRING
        },
        trim: true
      },
      specification_detail: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.SPECIFICATION_DETAIL_IS_REQUIRED
        },
        isObject: {
          errorMessage: ADMIN_MESSAGES.SPECIFICATION_DETAIL_MUST_BE_AN_OBJECT
        },
        trim: true
      },
      'specification_detail.rawHtml': {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.SPECIFICATION_DETAIL_RAW_HTML_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.SPECIFICATION_DETAIL_RAW_HTML_MUST_BE_A_STRING
        },
        trim: true
      },
      'specification_detail.plainText': {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.SPECIFICATION_DETAIL_PLAIN_TEXT_IS_REQUIRED
        },
        isString: {
          errorMessage: ADMIN_MESSAGES.SPECIFICATION_DETAIL_PLAIN_TEXT_MUST_BE_A_STRING
        },
        trim: true
      },
      main_images_detail: {
        isArray: {
          errorMessage: ADMIN_MESSAGES.MAIN_IMAGES_DETAIL_MUST_BE_AN_ARRAY
        },
        custom: {
          options: (value) => {
            if (value.length === 0) {
              throw new Error(ADMIN_MESSAGES.MAIN_IMAGES_DETAIL_CANNOT_BE_EMPTY)
            }
            return true
          }
        }
      },
      'main_images_detail.*': {
        isString: {
          errorMessage: ADMIN_MESSAGES.MAIN_IMAGE_DEATAIL_ITEM_MUST_BE_A_STRING
        },
        isURL: {
          errorMessage: ADMIN_MESSAGES.MAIN_IMAGE_DEATAIL_ITEM_MUST_BE_A_VALID_URL
        },
        trim: true
      },
      sub_images_detail: {
        isArray: {
          errorMessage: ADMIN_MESSAGES.SUB_IMAGES_DETAIL_MUST_BE_AN_ARRAY
        },
        custom: {
          options: (value) => {
            if (value.length === 0) {
              throw new Error(ADMIN_MESSAGES.SUB_IMAGES_DETAIL_CANNOT_BE_EMPTY)
            }
            return true
          }
        }
      },
      'sub_images_detail.*': {
        isString: {
          errorMessage: ADMIN_MESSAGES.SUB_IMAGE_DEATAIL_ITEM_MUST_BE_A_STRING
        },
        isURL: {
          errorMessage: ADMIN_MESSAGES.SUB_IMAGE_DEATAIL_ITEM_MUST_BE_A_VALID_URL
        },
        trim: true
      },
      filter_brand: {
        optional: true,
        isMongoId: {
          errorMessage: ADMIN_MESSAGES.BRAND_ID_MUST_BE_A_VALID_MONGO_ID
        },
        customSanitizer: {
          options: (value) => (value === '' ? null : value)
        },
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              return true
            }
            const isExist = await filterBrandService.checkBrandIdExist(value)
            if (!isExist) {
              throw new Error(ADMIN_MESSAGES.BRAND_ID_NOT_FOUND)
            }
            return true
          }
        }
      },
      filter_dac_tinh: {
        optional: true,
        isMongoId: {
          errorMessage: ADMIN_MESSAGES.DAC_TINH_ID_MUST_BE_A_VALID_MONGO_ID
        },
        customSanitizer: {
          options: (value) => (value === '' ? null : value)
        },
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              return true
            }
            const isExist = await filterDacTinhService.checkDacTinhIdExist(value)
            if (!isExist) {
              throw new Error(ADMIN_MESSAGES.DAC_TINH_ID_NOT_FOUND)
            }
            return true
          }
        }
      },
      filter_hsk_ingredients: {
        optional: true,
        isMongoId: {
          errorMessage: ADMIN_MESSAGES.INGREDIENT_ID_MUST_BE_A_VALID_MONGO_ID
        },
        customSanitizer: {
          options: (value) => (value === '' ? null : value)
        },
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              return true
            }
            const isExist = await filterHskIngredientService.checkIngredientIdExist(value)
            if (!isExist) {
              throw new Error(ADMIN_MESSAGES.INGREDIENT_ID_NOT_FOUND)
            }
            return true
          }
        }
      },
      filter_hsk_product_type: {
        optional: true,
        isMongoId: {
          errorMessage: ADMIN_MESSAGES.PRODUCT_TYPE_ID_MUST_BE_A_VALID_MONGO_ID
        },
        customSanitizer: {
          options: (value) => (value === '' ? null : value)
        },
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              return true
            }
            const isExist = await filterHskProductTypeService.checkProductTypeIdExist(value)
            if (!isExist) {
              throw new Error(ADMIN_MESSAGES.PRODUCT_TYPE_ID_NOT_FOUND)
            }
            return true
          }
        }
      },
      filter_hsk_size: {
        optional: true,
        isMongoId: {
          errorMessage: ADMIN_MESSAGES.SIZE_ID_MUST_BE_A_VALID_MONGO_ID
        },
        customSanitizer: {
          options: (value) => (value === '' ? null : value)
        },
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              return true
            }
            const isExist = await filterHskSizeService.checkSizeIdExist(value)
            if (!isExist) {
              throw new Error(ADMIN_MESSAGES.SIZE_ID_NOT_FOUND)
            }
            return true
          }
        }
      },
      filter_hsk_skin_type: {
        optional: true,
        isMongoId: {
          errorMessage: ADMIN_MESSAGES.SKIN_TYPE_ID_MUST_BE_A_VALID_MONGO_ID
        },
        customSanitizer: {
          options: (value) => (value === '' ? null : value)
        },
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              return true
            }
            const isExist = await filterHskSkinTypeService.checkSkinTypeIdExist(value)
            if (!isExist) {
              throw new Error(ADMIN_MESSAGES.SKIN_TYPE_ID_NOT_FOUND)
            }
            return true
          }
        }
      },
      filter_hsk_uses: {
        optional: true,
        isMongoId: {
          errorMessage: ADMIN_MESSAGES.USES_ID_MUST_BE_A_VALID_MONGO_ID
        },
        customSanitizer: {
          options: (value) => (value === '' ? null : value)
        },
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              return true
            }
            const isExist = await filterHskUsesService.checkUsesIdExist(value)
            if (!isExist) {
              throw new Error(ADMIN_MESSAGES.USES_ID_NOT_FOUND)
            }
            return true
          }
        }
      },
      filter_origin: {
        optional: true,
        isMongoId: {
          errorMessage: ADMIN_MESSAGES.ORIGIN_ID_MUST_BE_A_VALID_MONGO_ID
        },
        customSanitizer: {
          options: (value) => (value === '' ? null : value)
        },
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              return true
            }
            const isExist = await filterOriginService.checkOriginIdExist(value)
            if (!isExist) {
              throw new Error(ADMIN_MESSAGES.ORIGIN_ID_NOT_FOUND)
            }
            return true
          }
        }
      },
      quantity: {
        notEmpty: {
          errorMessage: ADMIN_MESSAGES.QUANTITY_IS_REQUIRED
        },
        isNumeric: {
          errorMessage: ADMIN_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
        },
        custom: {
          options: (value) => {
            const numericValue = Number(value)

            if (!Number.isInteger(numericValue)) {
              throw new Error(ADMIN_MESSAGES.QUANTITY_MUST_BE_AN_INTEGER)
            }
            if (numericValue < 0) {
              throw new Error(ADMIN_MESSAGES.QUANTITY_MUST_BE_NON_NEGATIVE)
            }

            if (numericValue > PRODUCT.MAX_QUANTITY) {
              throw new Error(`${ADMIN_MESSAGES.QUANTITY_EXCEEDS_LIMIT} ${PRODUCT.MAX_QUANTITY}`)
            }
            return true
          }
        },
        toInt: true
      },
      state: {
        optional: true,
        isString: {
          errorMessage: 'State must be a string'
        },
        isIn: {
          options: [Object.values(ProductState)],
          errorMessage: `${ADMIN_MESSAGES.STATE_MUST_BE_ONE_OF}: ${Object.values(ProductState).join(', ')}`
        }
      }
    },
    ['body']
  )
)
