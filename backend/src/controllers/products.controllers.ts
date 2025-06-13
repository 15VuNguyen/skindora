import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { PRODUCTS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import databaseService from '~/services/database.services'
import productService from '~/services/product.services'
import feedBackService from '~/services/review.services'
import { sendPaginatedResponse } from '~/utils/pagination.helper'

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
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
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
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
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
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
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
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
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
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
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
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

export const getReviewController = async (req: Request, res: Response) => {
  const { productId } = req.params
  const limit = parseInt(req.query.limit as string) || 10
  const currentPage = parseInt(req.query.currentPage as string) || 1

  try {
    const response = await feedBackService.getReview(productId, currentPage, limit)
    const { data, ...info } = response
    res.status(200).json({ status: 200, data, pagination: { ...info } })
  } catch (error: any) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    res.status(statusCode).json({ status: statusCode, message: error.message || 'Internal Server Error' })
  }
}

// export const getAllProductController = async (req: Request, res: Response) => {
//   try {
//     const products = await productService.getAllProducts()
//     res.json({
//       message: PRODUCTS_MESSAGES.GET_ALL_PRODUCT_SUCCESS,
//       products
//     })
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
//     res.status(500).json({ error: errorMessage })
//   }
// }
// export const getAllProductController = async (req: Request, res: Response, next: NextFunction) => {
//   // Lấy collection từ database service và truyền vào helper
//   await sendPaginatedResponse(res, next, databaseService.products, req.query)
// }
export const getAllProductController = async (req: Request, res: Response, next: NextFunction) => {
  // Lấy collection từ database service và truyền vào helper
  // Helper sẽ làm tất cả phần việc còn lại
  await sendPaginatedResponse(res, next, databaseService.products, req.query)
}

// Các controller khác (tạo, sửa, xóa) sẽ tự xử lý response của chúng
export const getProductDetailsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ... logic lấy sản phẩm theo id
    // const product = await productService.getById(req.params.id);
    // return res.status(200).json({ message: 'Thành công', data: product });
  } catch (error) {
    next(error)
  }
}
