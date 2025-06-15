import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { Request, Response, NextFunction } from 'express'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import { Role } from '~/constants/enums'
import { VoucherType } from '~/models/schemas/Voucher.schema'

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

export const isValidToActiveValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const voucher = req.voucher as VoucherType

    const now = new Date()
    const endDate = new Date(voucher.endDate)

    if (endDate <= now) {
      res.status(400).json({ message: ADMIN_MESSAGES.VOUCHER_EXPIRED })
    }
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
