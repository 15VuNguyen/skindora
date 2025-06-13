import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { Filter, ObjectId } from 'mongodb'
import { OrderStatus, Role } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ORDER_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { isAdminOrStaffValidator } from '~/middlewares/admin.middlewares'
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
  try {
    const result = await ordersService.buyNow(user_id, req.body)
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
  try {
    const result = await ordersService.checkOut(req.body, user_id)
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

  if(!isAdminOrStaff && !isOwner){
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

//Manage orders: Staff and Admin only
export const getAllOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  const filter: Filter<Order> = {}
  if(req.query.status){
    filter.Status = req.query.status as OrderStatus
  }
  await sendPaginatedResponse(res, next, databaseService.orders, req.query, filter)
}

export const getAllOrdersByUserIdController = async (req: Request<{ userId: string }>, res: Response, next: NextFunction) => {
    const filter: Filter<Order> = {}
    if(req.params.userId){
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


