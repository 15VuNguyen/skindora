import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import databaseService from '~/services/database.services'
import {
  createNewFilterHskSizeReqBody,
  disableFilterHskSizeReqBody,
  updateFilterHskSizeReqBody
} from '~/models/requests/Admin.requests'
import filterHskSizeService from '~/services/filterHskSize.services'
import { ObjectId } from 'mongodb'
import { getLocalTime } from '~/utils/date'
import { Filter } from 'mongodb'
import FilterHskSize from '~/models/schemas/FilterHskSize.schema'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { GenericFilterState } from '~/constants/enums'

export const getAllFilterHskSizesController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.filterHskSize, req.query)
}

export const createNewFilterHskSizeController = async (
  req: Request<ParamsDictionary, any, createNewFilterHskSizeReqBody>,
  res: Response
) => {
  const result = await filterHskSizeService.createNewFilterSize(req.body)
  res.json({ message: ADMIN_MESSAGES.CREATE_NEW_FILTER_SIZE_SUCCESS, result })
}

export const getFilterHskSizeByIdController = async (req: Request<{ _id: string }>, res: Response) => {
  const { _id } = req.params
  const result = await databaseService.filterHskSize.findOne({ _id: new ObjectId(_id) })
  if (!result) {
    res.status(404).json({
      message: ADMIN_MESSAGES.FILTER_SIZE_NOT_FOUND
    })
  }
  res.json({ data: result })
}

export const updateFilterHskSizeController = async (
  req: Request<{ _id: string }, any, updateFilterHskSizeReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const result = await filterHskSizeService.updateFilterSize(_id, req.body)
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_SIZE_SUCCESS, result })
}

export const disableFilterHskSizeController = async (
  req: Request<{ _id: string }, any, disableFilterHskSizeReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const { state } = req.body
  const currentDate = new Date()
  const vietnamTimezoneOffset = 7 * 60
  const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

  const result = await databaseService.filterHskSize.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: { state, updated_at: localTime } },
    { returnDocument: 'after' }
  )
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_SIZE_STATE_SUCCESS, data: result })
}

export const searchFilterHskSizesController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.query
  const filter: Filter<FilterHskSize> = {}
  if (keyword) {
    filter.option_name = { $regex: keyword as string, $options: 'i' }
  }
  await sendPaginatedResponse(res, next, databaseService.filterHskSize, req.query, filter)
}

export const getActiveFilterHskSizesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databaseService.filterHskSize.find({ state: GenericFilterState.ACTIVE }).toArray();
    res.json({
      message: ADMIN_MESSAGES.GET_ACTIVE_FILTER_SIZES_SUCCESSFULLY,
      data: result
    });
  } catch (error) {
    next(error);
  }
};