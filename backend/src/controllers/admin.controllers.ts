import { Request, Response, NextFunction } from 'express'
import { ADMIN_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { sendPaginatedResponse } from '~/utils/pagination.helper'

export const getAllUserController = async (req: Request, res: Response, next: NextFunction) => {
  sendPaginatedResponse(res, next, databaseService.users, req.query)
}
