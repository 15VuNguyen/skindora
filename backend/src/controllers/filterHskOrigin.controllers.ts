// src/controllers/filterHskOrigin.controllers.ts

import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import databaseService from '~/services/database.services'
import {
  createNewFilterHskOriginReqBody,
  disableFilterHskOriginReqBody,
  updateFilterHskOriginReqBody
} from '~/models/requests/Admin.requests'
import { ObjectId } from 'mongodb'
import { getLocalTime } from '~/utils/date'
import { Filter } from 'mongodb'
import FilterHskOrigin from '~/models/schemas/FilterHskOrigin.schema'
import { ADMIN_MESSAGES } from '~/constants/messages'
import filterOriginService from '~/services/filterOrigin.services'
import { GenericFilterState } from '~/constants/enums'

export const getAllFilterHskOriginsController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.filterOrigin, req.query)
}

export const createNewFilterHskOriginController = async (
  req: Request<ParamsDictionary, any, createNewFilterHskOriginReqBody>,
  res: Response
) => {
  const result = await filterOriginService.createNewFilterOrigin(req.body)
  res.json({ message: ADMIN_MESSAGES.CREATE_NEW_FILTER_ORIGIN_SUCCESS, result })
}

export const getFilterHskOriginByIdController = async (req: Request<{ _id: string }>, res: Response) => {
  const { _id } = req.params
  const result = await databaseService.filterOrigin.findOne({ _id: new ObjectId(_id) })
  if (!result) {
    res.status(404).json({
      message: ADMIN_MESSAGES.FILTER_ORIGIN_NOT_FOUND
    })
  }
  res.json({ data: result })
}

export const updateFilterHskOriginController = async (
  req: Request<{ _id: string }, any, updateFilterHskOriginReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const result = await filterOriginService.updateFilterOrigin(_id, req.body)
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_ORIGIN_SUCCESS, result })
}

export const disableFilterHskOriginController = async (
  req: Request<{ _id: string }, any, disableFilterHskOriginReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const { state } = req.body
  const currentDate = new Date()
  const vietnamTimezoneOffset = 7 * 60
  const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

  const result = await databaseService.filterOrigin.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: { state, updated_at: localTime } },
    { returnDocument: 'after' }
  )
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_ORIGIN_STATE_SUCCESS, data: result })
}

export const searchFilterHskOriginsController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.query
  const filter: Filter<FilterHskOrigin> = {}
  if (keyword) {
    filter.option_name = { $regex: keyword as string, $options: 'i' }
  }
  await sendPaginatedResponse(res, next, databaseService.filterOrigin, req.query, filter)
}

export const getActiveFilterHskOriginsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databaseService.filterOrigin.find({ state: GenericFilterState.ACTIVE }).toArray();
    res.json({
      message: ADMIN_MESSAGES.GET_ACTIVE_FILTER_ORIGINS_SUCCESSFULLY,
      data: result
    });
  } catch (error) {
    next(error);
  }
};