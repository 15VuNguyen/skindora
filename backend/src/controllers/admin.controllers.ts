import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Filter } from 'mongodb'
import { ProductState, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { createNewFilterBrandReqBody, UpdateUserStateReqBody } from '~/models/requests/Admin.requests'
import { updateProductReqBody, UpdateProductStateReqBody } from '~/models/requests/Product.requests'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import Product from '~/models/schemas/Product.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import filterBrandService from '~/services/filterBrand.services'
import productService from '~/services/product.services'
import usersService from '~/services/users.services'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import aiUsageService from '~/services/aiUsage.services'

export const getAllUserController = async (req: Request, res: Response, next: NextFunction) => {
  sendPaginatedResponse(res, next, databaseService.users, req.query)
}

export const getUserDetailController = async (req: Request, res: Response) => {
  const { _id } = req.params
  const user = await usersService.getUserDetail(_id)
  res.json({
    message: ADMIN_MESSAGES.GET_USER_DETAIL_SUCCESS,
    result: user
  })
}

export const createNewFilterBrandController = async (
  req: Request<ParamsDictionary, any, createNewFilterBrandReqBody>,
  res: Response
) => {
  try {
    const result = await filterBrandService.createNewFilterBrand(req.body)
    res.json({
      message: ADMIN_MESSAGES.CREATE_NEW_FILTER_BRAND_SUCCESS,
      result
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : HTTP_STATUS.INTERNAL_SERVER_ERROR
    res.status(500).json({ error: errorMessage })
  }
}

export const updateProductController = async (
  req: Request<ParamsDictionary, any, updateProductReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params
    const result = await productService.updateProduct(_id, req.body)
    if (!result) {
      res.status(404).json({
        message: ADMIN_MESSAGES.PRODUCT_NOT_FOUND
      })
    }
    res.json({
      message: ADMIN_MESSAGES.UPDATE_PRODUCT_SUCCESS,
      result
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: ADMIN_MESSAGES.UPDATE_PRODUCT_FAILED,
        error: error.message
      })
    } else {
      res.status(500).json({
        message: ADMIN_MESSAGES.UPDATE_PRODUCT_FAILED,
        error: 'An unexpected error occurred'
      })
    }
  }
}

export const updateUserStateController = async (
  req: Request<ParamsDictionary, any, UpdateUserStateReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { verify } = req.body
    const { user_id } = req.decoded_authorization as TokenPayLoad

    const result = await usersService.updateUserState(id, verify, user_id)

    res.json({
      message: ADMIN_MESSAGES.UPDATE_USER_STATE_SUCCESS,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const updateProductStateController = async (
  req: Request<ParamsDictionary, any, UpdateProductStateReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params
    const { state } = req.body
    const { user_id } = req.decoded_authorization as TokenPayLoad

    const result = await productService.updateProductState(_id, state, user_id)

    res.json({
      message: ADMIN_MESSAGES.UPDATE_PRODUCT_STATE_SUCCESS,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getOnSaleProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Filter<Product> = { state: ProductState.ACTIVE }
    await sendPaginatedResponse(res, next, databaseService.products, req.query, filter)
  } catch (error) {
    next(error)
  }
}

export const getLowStockProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Filter<Product> = { quantity: { $gt: 0, $lte: 10 } }
    await sendPaginatedResponse(res, next, databaseService.products, req.query, filter)
  } catch (error) {
    next(error)
  }
}

export const getOutOfStockProductsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: Filter<Product> = { quantity: 0 }
    await sendPaginatedResponse(res, next, databaseService.products, req.query, filter)
  } catch (error) {
    next(error)
  }
}

export const getUnverifiedUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<User> = { verify: UserVerifyStatus.Unverified }
  const projection = {
    password: 0,
    email_verify_token: 0,
    forgot_password_token: 0
  }
  await sendPaginatedResponse(res, next, databaseService.users, req.query, filter, projection)
}

export const getVerifiedUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<User> = { verify: UserVerifyStatus.Verified }
  const projection = {
    password: 0,
    email_verify_token: 0,
    forgot_password_token: 0
  }
  await sendPaginatedResponse(res, next, databaseService.users, req.query, filter, projection)
}

export const getBannedUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<User> = { verify: UserVerifyStatus.Banned }
  const projection = {
    password: 0,
    email_verify_token: 0,
    forgot_password_token: 0
  }
  await sendPaginatedResponse(res, next, databaseService.users, req.query, filter, projection)
}

export const adminSearchProductsByNameController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword } = req.query
    const filter: Filter<Product> = {}

    if (keyword) {
      filter.name_on_list = {
        $regex: keyword as string,
        $options: 'i'
      }
    }

    await sendPaginatedResponse(res, next, databaseService.products, req.query, filter)
  } catch (error) {
    next(error)
  }
}

export const getAIUsageStatsController = async (req: Request, res: Response) => {
  const totalUsage = await aiUsageService.getTotalUsage()
  const dailyUsage = await aiUsageService.getDailyUsage()
  res.json({
    message: 'AI usage stats retrieved successfully',
    result: {
      totalUsage,
      dailyUsage
    }
  })
}
