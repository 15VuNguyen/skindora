import { Request, Response } from 'express'
import { CART_MESSAGES, PRODUCTS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { CartParams, UpdateCartPayload } from '~/models/requests/Cart.requests'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import cartService from '~/services/cart.services'

export const addToCartController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const product = req.product

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  if (!product) {
    res.status(400).json({
      message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND
    })
    return
  }

  try {
    const result = await cartService.addToCart(req.body, user_id, product)
    res.json({
      message: CART_MESSAGES.ADDED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: CART_MESSAGES.ADDED_FAILED,
      error: errorMessage
    })
  }
}

export const getCartController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const result = await cartService.fetchCart(user_id)
    res.json({
      message: CART_MESSAGES.FETCHED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: CART_MESSAGES.FETCHED_FAILED,
      error: errorMessage
    })
  }
}

export const updateCartController = async (req: Request<CartParams, UpdateCartPayload>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  const product = req.product!
  if (!product) {
    res.status(400).json({
      message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND
    })
    return
  }
  try {
    const result = await cartService.updateProductQuantityInCart(req.body, product, user_id)
    res.json({
      message: CART_MESSAGES.UPDATED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: CART_MESSAGES.UPDATED_FAILED,
      error: errorMessage
    })
  }
}
export const removeFromCartController = async (req: Request<CartParams>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const productId = req.params.productId
    const result = await cartService.removeProductFromCart(productId, user_id)
    res.json({
      message: CART_MESSAGES.REMOVED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: CART_MESSAGES.REMOVED_FAILED,
      error: errorMessage
    })
  }
}

export const clearCartController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const result = await cartService.clearCart(user_id)
    res.json({
      message: CART_MESSAGES.CLEAR_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: CART_MESSAGES.CLEAR_FAILED,
      error: errorMessage
    })
  }
}
