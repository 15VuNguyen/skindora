import { Request, Response, NextFunction } from 'express'
import { Filter, ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES, PRODUCTS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import databaseService from '~/services/database.services'
import productService from '~/services/product.services'
import feedBackService from '~/services/review.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import { CreateNewProductReqBody } from '~/models/requests/Product.requests'
import Review from '~/models/schemas/Reviewschema'
import logger from '~/utils/logger'
import Product from '~/models/schemas/Product.schema'
import { ProductState } from '~/constants/enums'

export const addToWishListController = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.body
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(404).json({ status: 404, message: USERS_MESSAGES.USER_NOT_FOUND })
    return
  }

  if (!productId || !Array.isArray(productId) || productId.length === 0) {
    res.status(400).json({ status: 400, message: PRODUCTS_MESSAGES.EMPTY_PRODUCT_LIST })
    return
  }

  try {
    await productService.addToWishList(user_id, productId)
    res.status(200).json({ status: 200, message: PRODUCTS_MESSAGES.PRODUCT_ADDED_TO_WISHLIST })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}

export const getWishListController = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  try {
    const wishList = await productService.getWishList(user_id)
    res.status(200).json({ status: 200, data: wishList })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}

export const removeFromWishListController = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const productID = req.body.productId

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  try {
    const wishList = await productService.removeFromWishList(user_id, productID)
    res.status(200).json({ status: 200, data: wishList })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}
export const getProductFromWishListController = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const productID = await productService.getWishList(user_id)

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  try {
    const wishList = await productService.getProductsFromWishList(productID)
    res.status(200).json({ status: 200, data: wishList })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}
export const addNewReviewController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  const { orderId, productId } = req.params
  try {
    const response = await feedBackService.addReview(user_id, orderId, productId, req.body)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}

export const updateReviewController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  const { orderId, productId } = req.params
  try {
    const response = await feedBackService.updateReview(user_id, orderId, productId, req.body)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}

export const removeReviewController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  const { orderId, productId } = req.params
  try {
    const response = await feedBackService.removeReview(user_id, orderId, productId)
    res.status(200).json({ status: 200, data: response })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message ?? 'Internal Server Error' })
  }
}

export const getReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const filter: Filter<Review> = {
      isDeleted: false,
      productID: new ObjectId(req.params.productId)
    }

    if (req.query.rating) {
      const rating = parseInt(req.query.rating as string, 10)
      if (!isNaN(rating)) {
        filter.rating = rating
      }
    }

    const [totalRecords, paginatedReviews, allReviews] = await Promise.all([
      databaseService.reviews.countDocuments(filter),
      databaseService.reviews.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      databaseService.reviews.find({ productID: new ObjectId(req.params.productId), isDeleted: false }).toArray()
    ])

    const totalPages = Math.ceil(totalRecords / limit)

    const total = allReviews.length
    const average = total > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / total : 0
    const grouped = allReviews.reduce(
      (acc, r) => {
        acc[r.rating] = (acc[r.rating] || 0) + 1
        return acc
      },
      {} as Record<number, number>
    )

    res.status(200).json({
      data: paginatedReviews,
      pagination: {
        currentPage: page,
        limit,
        totalPages,
        totalRecords
      },
      total,
      average,
      grouped
    })
  } catch (err) {
    next(err)
  }
}

export const getAllProductController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<Product> = {}
  const filterFields = [
    'filter_brand',
    'filter_dac_tinh',
    'filter_hsk_ingredients',
    'filter_hsk_product_type',
    'filter_hsk_size',
    'filter_hsk_skin_type',
    'filter_hsk_uses',
    'filter_origin'
  ]
  filterFields.forEach((field) => {
    if (req.query[field]) {
      //Gán giá trị filter vào object, chuyển đổi sang ObjectId
      filter[field as keyof Filter<Product>] = new ObjectId(req.query[field] as string)
    }
  })

  //Thêm logic tìm kiếm theo tên nếu có keyword
  if (req.query.keyword) {
    filter.name_on_list = {
      $regex: req.query.keyword as string,
      $options: 'i'
    }
  }

  await sendPaginatedResponse(res, next, databaseService.products, req.query, filter)
}

export const userGetAllProductController = async (req: Request, res: Response, next: NextFunction) => {
  const projection = {
    name_on_list: 1,
    engName_on_list: 1,
    price_on_list: 1,
    image_on_list: 1,
    hover_image_on_list: 1,
    product_detail_url: 1,
    productName_detail: 1,
    engName_detail: 1,
    _id: 1
  }
  const filter: Filter<Product> = {}
  const filterFields = [
    'filter_brand',
    'filter_dac_tinh',
    'filter_hsk_ingredients',
    'filter_hsk_product_type',
    'filter_hsk_size',
    'filter_hsk_skin_type',
    'filter_hsk_uses',
    'filter_origin'
  ]
  filterFields.forEach((field) => {
    if (req.query[field]) {
      //Gán giá trị filter vào object, chuyển đổi sang ObjectId
      filter[field as keyof Filter<Product>] = new ObjectId(req.query[field] as string)
    }
  })

  //Thêm logic tìm kiếm theo tên nếu có keyword
  if (req.query.keyword) {
    filter.name_on_list = {
      $regex: req.query.keyword as string,
      $options: 'i'
    }
  }
  await sendPaginatedResponse(res, next, databaseService.products, req.query, filter, projection)
  // await sendPaginatedResponse(res, next, databaseService.products, req.query, filter)
}
export const userGetAllProductControllerWithQ = async (req: Request, res: Response, next: NextFunction) => {
  const projection = {
    name_on_list: 1,
    engName_on_list: 1,
    price_on_list: 1,
    image_on_list: 1,
    hover_image_on_list: 1,
    product_detail_url: 1,
    productName_detail: 1,
    engName_detail: 1,
    filter_brand: 1,
    quantity: 1,
    _id: 1
  }
  // const filter = {} as any
  const filter: Filter<any> = {}
  if (req.query.q) {
    const searchQuery = req.query.q as string
    filter.name_on_list = { $regex: searchQuery, $options: 'i' }
  }
  const validFilterKeys = [
    'filter_brand',
    'filter_hsk_skin_type',
    'filter_hsk_uses',
    'filter_hsk_product_type',
    'filter_dac_tinh',
    'filter_hsk_ingredients',
    'filter_hsk_size',
    'filter_origin'
  ]
  for (const key of validFilterKeys) {
    if (req.query[key]) {
      const filterValues = (req.query[key] as string).split(',')
      const objectIds = filterValues.map((id) => new ObjectId(id))
      if (objectIds.length > 0) {
        filter[key] = { $in: objectIds }
      }
    }
  }
  logger.info(filter)
  await sendPaginatedResponse(res, next, databaseService.products, req.query, filter, projection)
  // await sendPaginatedResponse(res, next, databaseService.products, req.query, filter)
}

export const createNewProductController = async (
  req: Request<ParamsDictionary, any, CreateNewProductReqBody>,
  res: Response
) => {
  try {
    const result = await productService.createNewProduct(req.body)
    res.json({
      message: ADMIN_MESSAGES.CREATE_NEW_PRODUCT_SUCCESS,
      result
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : HTTP_STATUS.INTERNAL_SERVER_ERROR
    res.status(500).json({ error: errorMessage })
  }
}

export const getProductDetailController = async (req: Request, res: Response) => {
  const { _id } = req.params
  const product = await productService.getProductDetail(_id)
  res.json({
    message: ADMIN_MESSAGES.GET_PRODUCT_DETAIL_SUCCESS,
    result: product
  })
}

export const getProductStatsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await productService.getProductStats()
    res.json({
      message: ADMIN_MESSAGES.GET_PRODUCT_STATS_SUCCESS,
      result: stats
    })
  } catch (error) {
    next(error)
  }
}

export const userSearchProductsController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.query
  const filter: Filter<Product> = {}

  filter.state = ProductState.ACTIVE

  if (keyword) {
    filter.name_on_list = {
      $regex: keyword as string,
      $options: 'i'
    }
  }

  await sendPaginatedResponse(res, next, databaseService.products, req.query, filter)
}
