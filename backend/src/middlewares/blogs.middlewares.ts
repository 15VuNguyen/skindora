import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { PostState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES, BLOG_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

const createArrayObjectIdValidator = (collection: keyof typeof databaseService, notFoundMessage: string) => ({
  optional: true,
  isArray: {
    errorMessage: BLOG_MESSAGES.INVALID_ARRAY
  },
  custom: {
    options: async (values: string[]) => {
      if (!values) return true
      for (const value of values) {
        if (!ObjectId.isValid(value)) {
          throw new Error(BLOG_MESSAGES.INVALID_OBJECT_ID)
        }
        const doc = await (databaseService[collection] as any).findOne({ _id: new ObjectId(value) })
        if (!doc) {
          throw new Error(notFoundMessage)
        }
      }
      return true
    }
  }
})

export const createBlogValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: BLOG_MESSAGES.TITLE_REQUIRED
        },
        isLength: {
          options: { min: 10, max: 150 },
          errorMessage: BLOG_MESSAGES.INVALID_TITLE_LENGTH
        }
      },
      'content.rawHtml': {
        notEmpty: {
          errorMessage: BLOG_MESSAGES.CONTENT_REQUIRED
        },
        isLength: {
          options: { min: 50, max: 20000 },
          errorMessage: BLOG_MESSAGES.INVALID_CONTENT_LENGTH
        }
      },
      'content.plainText': {
        notEmpty: {
          errorMessage: BLOG_MESSAGES.CONTENT_REQUIRED
        },
        isLength: {
          options: { min: 30, max: 20000 },
          errorMessage: BLOG_MESSAGES.INVALID_CONTENT_LENGTH
        }
      },
      image_on_list: {
        notEmpty: {
          errorMessage: BLOG_MESSAGES.IMAGE_ON_LIST_REQUIRED
        },
        trim: true,
        isURL: {
          errorMessage: BLOG_MESSAGES.INVALID_URL_IMAGE_ON_LIST
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [Object.values(PostState)],
          errorMessage: BLOG_MESSAGES.INVALID_BLOG_STATE
        }
      },
      authorId: {
        optional: true,
        isMongoId: {
          errorMessage: BLOG_MESSAGES.INVALID_AUTHOR_ID
        },
        custom: {
          options: async (value) => {
            if (!value) return true
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
      },
      filter_brand: createArrayObjectIdValidator('filterBrand', ADMIN_MESSAGES.BRAND_ID_NOT_FOUND),
      filter_dac_tinh: createArrayObjectIdValidator('filterDacTinh', ADMIN_MESSAGES.DAC_TINH_ID_NOT_FOUND),
      filter_hsk_ingredients: createArrayObjectIdValidator(
        'filterHskIngredient',
        ADMIN_MESSAGES.INGREDIENT_ID_NOT_FOUND
      ),
      filter_hsk_product_type: createArrayObjectIdValidator(
        'filterHskProductType',
        ADMIN_MESSAGES.PRODUCT_TYPE_ID_NOT_FOUND
      ),
      filter_hsk_size: createArrayObjectIdValidator('filterHskSize', ADMIN_MESSAGES.SIZE_ID_NOT_FOUND),
      filter_hsk_skin_type: createArrayObjectIdValidator('filterHskSkinType', ADMIN_MESSAGES.SKIN_TYPE_ID_NOT_FOUND),
      filter_hsk_uses: createArrayObjectIdValidator('filterHskUses', ADMIN_MESSAGES.USES_ID_NOT_FOUND),
      filter_origin: createArrayObjectIdValidator('filterOrigin', ADMIN_MESSAGES.ORIGIN_ID_NOT_FOUND)
    },
    ['body']
  )
)

export const updateBlogValidator = validate(
  checkSchema(
    {
      id: {
        in: ['params'],
        isMongoId: {
          errorMessage: BLOG_MESSAGES.INVALID_OBJECT_ID
        },
        custom: {
          options: async (value) => {
            const post = await databaseService.posts.findOne({ _id: new ObjectId(value) })
            if (!post) {
              throw new ErrorWithStatus({
                message: BLOG_MESSAGES.POST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }

            return true
          }
        }
      },
      title: {
        optional: true,
        isLength: {
          options: { min: 10, max: 150 },
          errorMessage: BLOG_MESSAGES.INVALID_TITLE_LENGTH
        }
      },
      'content.rawHtml': {
        optional: true,
        isLength: {
          options: { min: 50, max: 20000 },
          errorMessage: BLOG_MESSAGES.INVALID_CONTENT_LENGTH
        }
      },
      'content.plainText': {
        optional: true,
        isLength: {
          options: { min: 30, max: 20000 },
          errorMessage: BLOG_MESSAGES.INVALID_CONTENT_LENGTH
        }
      },
      image_on_list: {
        optional: true,
        trim: true,
        isURL: {
          errorMessage: BLOG_MESSAGES.INVALID_URL_IMAGE_ON_LIST
        }
      },
      status: {
        optional: true,
        isIn: {
          options: [Object.values(PostState)],
          errorMessage: BLOG_MESSAGES.INVALID_BLOG_STATE
        }
      },
      authorId: {
        optional: true,
        isMongoId: {
          errorMessage: BLOG_MESSAGES.INVALID_AUTHOR_ID
        },
        custom: {
          options: async (value) => {
            if (!value) return true
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
      },
      filter_brand: createArrayObjectIdValidator('filterBrand', ADMIN_MESSAGES.BRAND_ID_NOT_FOUND),
      filter_dac_tinh: createArrayObjectIdValidator('filterDacTinh', ADMIN_MESSAGES.DAC_TINH_ID_NOT_FOUND),
      filter_hsk_ingredients: createArrayObjectIdValidator(
        'filterHskIngredient',
        ADMIN_MESSAGES.INGREDIENT_ID_NOT_FOUND
      ),
      filter_hsk_product_type: createArrayObjectIdValidator(
        'filterHskProductType',
        ADMIN_MESSAGES.PRODUCT_TYPE_ID_NOT_FOUND
      ),
      filter_hsk_size: createArrayObjectIdValidator('filterHskSize', ADMIN_MESSAGES.SIZE_ID_NOT_FOUND),
      filter_hsk_skin_type: createArrayObjectIdValidator('filterHskSkinType', ADMIN_MESSAGES.SKIN_TYPE_ID_NOT_FOUND),
      filter_hsk_uses: createArrayObjectIdValidator('filterHskUses', ADMIN_MESSAGES.USES_ID_NOT_FOUND),
      filter_origin: createArrayObjectIdValidator('filterOrigin', ADMIN_MESSAGES.ORIGIN_ID_NOT_FOUND)
    },
    ['body']
  )
)

export const getAllPostsValidator = validate(
  checkSchema(
    {
      filters: {
        in: ['body'],
        exists: {
          errorMessage: BLOG_MESSAGES.FILTERS_OBJECT_REQUIRED
        },
        isObject: {
          errorMessage: BLOG_MESSAGES.INVALID_FILTERS_OBJECT
        }
      },
      'filters.filter_brand': createArrayObjectIdValidator('filterBrand', ADMIN_MESSAGES.BRAND_ID_NOT_FOUND),
      'filters.filter_dac_tinh': createArrayObjectIdValidator('filterDacTinh', ADMIN_MESSAGES.DAC_TINH_ID_NOT_FOUND),
      'filters.filter_hsk_ingredients': createArrayObjectIdValidator(
        'filterHskIngredient',
        ADMIN_MESSAGES.INGREDIENT_ID_NOT_FOUND
      ),
      'filters.filter_hsk_product_type': createArrayObjectIdValidator(
        'filterHskProductType',
        ADMIN_MESSAGES.PRODUCT_TYPE_ID_NOT_FOUND
      ),
      'filters.filter_hsk_size': createArrayObjectIdValidator('filterHskSize', ADMIN_MESSAGES.SIZE_ID_NOT_FOUND),
      'filters.filter_hsk_skin_type': createArrayObjectIdValidator(
        'filterHskSkinType',
        ADMIN_MESSAGES.SKIN_TYPE_ID_NOT_FOUND
      ),
      'filters.filter_hsk_uses': createArrayObjectIdValidator('filterHskUses', ADMIN_MESSAGES.USES_ID_NOT_FOUND),
      'filters.filter_origin': createArrayObjectIdValidator('filterOrigin', ADMIN_MESSAGES.ORIGIN_ID_NOT_FOUND)
    },
    ['body']
  )
)

export const checkPostExist = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params
    const post = await databaseService.posts.findOne({_id: new ObjectId(id)})
    if(!post){
      throw new ErrorWithStatus({
        message: BLOG_MESSAGES.POST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const syncPostViewsValidator = validate(
  checkSchema(
    {
      batchSize: {
        optional: true,
        isInt: {
          options: {
            min: 1,
            max: 1000,
          },
          errorMessage: BLOG_MESSAGES.INVALID_BATCH_SIZE
        },
        toInt: true
      }
    },['body']
  )
)

export const getPostViewsByDateValidator = validate(
  checkSchema(
    {
      startDate: {
        in: ["query"],
        exists: {
          errorMessage: BLOG_MESSAGES.START_DATE_REQUIRED
        },
        isDate: {
          options: { format: "YYYY-MM-DD" },
          errorMessage: BLOG_MESSAGES.START_DATE_INVALID
        }
      },
      endDate: {
        in: ["query"],
        exists: {
          errorMessage: BLOG_MESSAGES.END_DATE_REQUIRED
        },
        isDate: {
          options: { format: "YYYY-MM-DD" },
          errorMessage: BLOG_MESSAGES.END_DATE_INVALID
        },
        custom: {
          options: (value, { req }) => {
            const start = new Date(req?.query?.startDate as string);
            const end = new Date(value);
            if (start > end) {
              throw new Error(BLOG_MESSAGES.START_END_DATE_INVALID);
            }
            return true;
          }
        }
      },
      groupBy: {
        in: ["query"],
        optional: true,
        isIn: {
          options: [["day", "month"]],
          errorMessage: BLOG_MESSAGES.GROUP_BY_INVALID
        }
      }
    },
    ["query"]
  )
);

export const getTopViewedPostsValidator = validate(
  checkSchema(
    {
      startDate: {
        in: ["query"],
        optional: true,
        isDate: { options: { format: "YYYY-MM-DD" }, errorMessage: BLOG_MESSAGES.START_DATE_INVALID }
      },
      endDate: {
        in: ["query"],
        optional: true,
        isDate: { options: { format: "YYYY-MM-DD" }, errorMessage: BLOG_MESSAGES.END_DATE_INVALID },
        custom: {
          options: (value, { req }) => {
            if (!req?.query?.startDate) return true;
            const start = new Date(req.query.startDate as string);
            const end = new Date(value);
            if (start > end) throw new Error(BLOG_MESSAGES.START_END_DATE_INVALID);
            return true;
          }
        }
      },
      limit: {
        in: ["query"],
        optional: true,
        isInt: { options: { min: 1, max: 100 }, errorMessage: BLOG_MESSAGES.LIMIT_INVALID },
        toInt: true
      }
    },
    ["query"]
  )
);

export const getViewsByPostValidator = validate(
  checkSchema(
    {
      postId: {
        in: ["params"],
        exists: { errorMessage: BLOG_MESSAGES.POST_ID_REQUIRED },
        isMongoId: { errorMessage: BLOG_MESSAGES.INVALID_OBJECT_ID }
      },
      startDate: {
        in: ["query"],
        optional: true,
        isDate: { options: { format: "YYYY-MM-DD" }, errorMessage: BLOG_MESSAGES.START_DATE_INVALID }
      },
      endDate: {
        in: ["query"],
        optional: true,
        isDate: { options: { format: "YYYY-MM-DD" }, errorMessage: BLOG_MESSAGES.END_DATE_INVALID },
        custom: {
          options: (value, { req }) => {
            if (!req?.query?.startDate) return true;
            const start = new Date(req.query.startDate as string);
            const end = new Date(value);
            if (start > end) throw new Error(BLOG_MESSAGES.START_END_DATE_INVALID);
            return true;
          }
        }
      }
    },
  )
);

