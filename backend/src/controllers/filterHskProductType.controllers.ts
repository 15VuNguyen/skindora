import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import databaseService from '~/services/database.services'
import {
  createNewFilterHskProductTypeReqBody,
  disableFilterHskProductTypeReqBody,
  updateFilterHskProductTypeReqBody
} from '~/models/requests/Admin.requests'
import filterHskProductTypeService from '~/services/filterHskProductType.services'
import { ObjectId } from 'mongodb'
import { getLocalTime } from '~/utils/date'
import { Filter } from 'mongodb'
import FilterHskProductType from '~/models/schemas/FilterHskProductType.schema'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { GenericFilterState } from '~/constants/enums'

export const getAllFilterHskProductTypesController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.filterHskProductType, req.query)
}

export const createNewFilterHskProductTypeController = async (
  req: Request<ParamsDictionary, any, createNewFilterHskProductTypeReqBody>,
  res: Response
) => {
  const result = await filterHskProductTypeService.createNewFilterProductType(req.body)
  res.json({ message: ADMIN_MESSAGES.CREATE_NEW_FILTER_PRODUCT_TYPE_SUCCESS, result })
}

export const getFilterHskProductTypeByIdController = async (req: Request<{ _id: string }>, res: Response) => {
  const { _id } = req.params
  const result = await databaseService.filterHskProductType.findOne({ _id: new ObjectId(_id) })
  if (!result) {
    res.status(404).json({
      message: ADMIN_MESSAGES.FILTER_PRODUCT_TYPE_NOT_FOUND
    })
  }
  res.json({ data: result })
}

export const updateFilterHskProductTypeController = async (
  req: Request<{ _id: string }, any, updateFilterHskProductTypeReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const result = await filterHskProductTypeService.updateFilterProductType(_id, req.body)
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_PRODUCT_TYPE_SUCCESS, result })
}

export const disableFilterHskProductTypeController = async (
  req: Request<{ _id: string }, any, disableFilterHskProductTypeReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const { state } = req.body
  const currentDate = new Date()
  const vietnamTimezoneOffset = 7 * 60
  const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

  const result = await databaseService.filterHskProductType.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: { state, updated_at: localTime } },
    { returnDocument: 'after' }
  )
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_PRODUCT_TYPE_STATE_SUCCESS, data: result })
}

export const searchFilterHskProductTypesController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.query
  const filter: Filter<FilterHskProductType> = {}
  if (keyword) {
    filter.option_name = { $regex: keyword as string, $options: 'i' }
  }
  await sendPaginatedResponse(res, next, databaseService.filterHskProductType, req.query, filter)
}

export const getActiveFilterHskProductTypesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databaseService.filterHskProductType.find({ state: GenericFilterState.ACTIVE }).toArray();
    res.json({
      message: ADMIN_MESSAGES.GET_ACTIVE_FILTER_PRODUCT_TYPES_SUCCESSFULLY,
      data: result
    });
  } catch (error) {
    next(error);
  }
};