import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { Filter, ObjectId } from 'mongodb'
import { CancelRequestStatus, OrderStatus, Role } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { OrderParams, OrderReqBody } from '~/models/requests/Orders.requests'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import Order from '~/models/schemas/Orders/Order.schema'
import databaseService from '~/services/database.services'
import ordersService from '~/services/orders.services'
import { getNextOrderStatus } from '~/utils/orderStatus'
import { sendPaginatedResponse } from '~/utils/pagination.helper'

export const prepareOrderController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const result = await ordersService.prepareOrder(user_id, req.body)
    res.json({
      message: ORDER_MESSAGES.PREPARED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.PREPARED_FAILED,
      error: errorMessage
    })
  }
}

export const buyNowController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }

  const product = req.product
  try {
    const result = await ordersService.buyNow(user_id, req.body.quantity, product)
    res.json({
      message: ORDER_MESSAGES.PREPARED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.PREPARED_FAILED,
      error: errorMessage
    })
  }
}

export const checkOutController = async (req: Request<ParamsDictionary, any, OrderReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  const voucher = req.voucher ?? undefined
  try {
    const result = await ordersService.checkOut(req.body, user_id, voucher)
    res.json({
      message: ORDER_MESSAGES.CREATED_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.CREATED_FAILED,
      error: errorMessage
    })
  }
}

export const getCurrentOrderController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const result = await ordersService.getCurrentOrder(user_id)
    res.json({
      message: ORDER_MESSAGES.GET_CURRENT_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.GET_CURRENT_FAIL,
      error: errorMessage
    })
  }
}

export const getAllOrdersByAuthUserController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const result = await ordersService.getAllOrdersByUserId(user_id)
    res.json({
      message: ORDER_MESSAGES.GET_ORDER_BY_USER_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.GET_ORDER_BY_USER_FAIL,
      error: errorMessage
    })
  }
}

export const getOrderByIdController = async (req: Request<OrderParams>, res: Response) => {
  const order = req.order
  const isAdminOrStaff = [Role.Admin, Role.Staff].includes(req.user?.roleid || 0)
  const isOwner = req.user?._id?.toString() === order?.UserID?.toString()

  if (!isAdminOrStaff && !isOwner) {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      status: HTTP_STATUS.FORBIDDEN,
      message: USERS_MESSAGES.ACCESS_DENIED
    })
    return
  }

  try {
    const result = await ordersService.getOrderById(order!)
    res.json({
      message: ORDER_MESSAGES.GET_ORDER_BY_ID_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.GET_ORDER_BY_ID_FAIL,
      error: errorMessage
    })
  }
}

export const requestCancelOrderController = async (req: Request<OrderParams>, res: Response) => {
  try {
    const order = req.order
    const result = await ordersService.requestCancelOrder(req.body, order!)
    res.json({
      message: ORDER_MESSAGES.CANCEL_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.CANCEL_FAIL,
      error: errorMessage
    })
  }
}

//Manage orders: Staff and Admin only
export const getAllOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<Order> = {}
  if (req.query.status) {
    filter.Status = req.query.status as OrderStatus
  }
  await sendPaginatedResponse(res, next, databaseService.orders, req.query, filter)
}

export const countOrderController = async (req:Request, res: Response) => {
  try {
    const result = await ordersService.countOrder()
    res.json({
      message: ORDER_MESSAGES.COUNT_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.COUNT_FAIL,
      error: errorMessage
    })
  }
}

export const getAllCancelledOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<Order> = {}
  filter['CancelRequest'] = { $exists: true }

  if (req.query.status) {
    filter['CancelRequest.status'] = req.query.status as CancelRequestStatus
  }
  await sendPaginatedResponse(res, next, databaseService.orders, req.query, filter)
}

export const getAllOrdersByUserIdController = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
) => {
  const filter: Filter<Order> = {}
  if (req.params.userId) {
    filter.UserID = new ObjectId(req.params.userId) as ObjectId
  }
  await sendPaginatedResponse(res, next, databaseService.orders, req.query, filter)
}

export const moveToNextStatusController = async (req: Request<OrderParams>, res: Response) => {
  try {
    const order = req.order
    const nextStatus = getNextOrderStatus(order?.Status!)

    await databaseService.orders.updateOne(
      { _id: order?._id },
      { $set: { Status: nextStatus!, updatedAt: new Date() } }
    )

    res.status(200).json({
      message: ORDER_MESSAGES.UPDATE_TO_NEXT_STATUS_SUCCESS,
      result: {
        orderId: order?._id,
        previousStatus: order?.Status,
        updatedStatus: nextStatus
      }
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.UPDATE_TO_NEXT_STATUS_FAIL,
      error: errorMessage
    })
  }
}

export const approveCancelRequestController = async (req: Request<OrderParams>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const order = req.order
    const result = await ordersService.approveCancelRequest(req.body, user_id, order!, {
      status: CancelRequestStatus.APPROVED
    })
    res.json({
      message: ORDER_MESSAGES.CANCEL_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.CANCEL_FAIL,
      error: errorMessage
    })
  }
}

export const rejectCancelRequestController = async (req: Request<OrderParams>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const order = req.order
    const result = await ordersService.rejectCancelRequest(req.body, user_id, order!, {
      status: CancelRequestStatus.REJECTED
    })
    res.json({
      message: ORDER_MESSAGES.CANCEL_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.CANCEL_FAIL,
      error: errorMessage
    })
  }
}

export const cancelOrderController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad

  if (!user_id || typeof user_id !== 'string') {
    res.status(401).json({ status: 401, message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED })
    return
  }
  try {
    const order = req.order
    const result = await ordersService.cancelOrder(req.body, user_id, order!)
    res.json({
      message: ORDER_MESSAGES.CANCEL_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.CANCEL_FAIL,
      error: errorMessage
    })
  }
}

export const getOrderRevenueController = async (req: Request, res: Response) => {
  try {
    const {
      date,
      from,
      to,
      filter_brand,
      filter_dac_tinh,
      filter_hsk_ingredients,
      filter_hsk_product_type,
      filter_hsk_size,
      filter_hsk_skin_type,
      filter_hsk_uses,
      filter_origin
    } = req.query

    const result = await ordersService.getOrderRevenue({
      specificDate: typeof date === 'string' ? date : undefined,
      fromDate: typeof from === 'string' ? from : undefined,
      toDate: typeof to === 'string' ? to : undefined,
      filterBrand: filter_brand ? new ObjectId(filter_brand as string) : undefined,
      filterDacTinh: filter_dac_tinh ? new ObjectId(filter_dac_tinh as string) : undefined,
      filterHskIngredients: filter_hsk_ingredients ? new ObjectId(filter_hsk_ingredients as string) : undefined,
      filterHskProductType: filter_hsk_product_type ? new ObjectId(filter_hsk_product_type as string) : undefined,
      filterHskSize: filter_hsk_size ? new ObjectId(filter_hsk_size as string) : undefined,
      filterHskSkinType: filter_hsk_skin_type ? new ObjectId(filter_hsk_skin_type as string) : undefined,
      filterHskUses: filter_hsk_uses ? new ObjectId(filter_hsk_uses as string) : undefined,
      filterOrigin: filter_origin ? new ObjectId(filter_origin as string) : undefined
    })
    res.json({
      message: ORDER_MESSAGES.GET_REVENUE_SUCCESS,
      result
    })
  } catch (error) {
    const statusCode = error instanceof ErrorWithStatus ? error.status : 500
    const errorMessage = error instanceof ErrorWithStatus ? error.message : String(error)

    res.status(statusCode).json({
      message: ORDER_MESSAGES.CANCEL_FAIL,
      error: errorMessage
    })
  }
}
