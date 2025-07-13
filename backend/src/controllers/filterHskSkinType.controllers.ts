import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import databaseService from '~/services/database.services'
import {
  createNewFilterHskSkinTypeReqBody,
  disableFilterHskSkinTypeReqBody,
  updateFilterHskSkinTypeReqBody
} from '~/models/requests/Admin.requests'
import filterHskSkinTypeService from '~/services/filterHskSkinType.services'
import { ObjectId } from 'mongodb'
import { getLocalTime } from '~/utils/date'
import { Filter } from 'mongodb'
import FilterHskSkinType from '~/models/schemas/FilterHskSkinType.schema'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { GenericFilterState } from '~/constants/enums'

export const getAllFilterHskSkinTypesController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.filterHskSkinType, req.query)
}

export const createNewFilterHskSkinTypeController = async (
  req: Request<ParamsDictionary, any, createNewFilterHskSkinTypeReqBody>,
  res: Response
) => {
  const result = await filterHskSkinTypeService.createNewFilterSkinType(req.body)
  res.json({ message: ADMIN_MESSAGES.CREATE_NEW_FILTER_SKIN_TYPE_SUCCESS, result })
}

export const getFilterHskSkinTypeByIdController = async (req: Request<{ _id: string }>, res: Response) => {
  const { _id } = req.params
  const result = await databaseService.filterHskSkinType.findOne({ _id: new ObjectId(_id) })
  if (!result) {
    res.status(404).json({
      message: ADMIN_MESSAGES.FILTER_SKIN_TYPE_NOT_FOUND
    })
  }
  res.json({ data: result })
}

export const updateFilterHskSkinTypeController = async (
  req: Request<{ _id: string }, any, updateFilterHskSkinTypeReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const result = await filterHskSkinTypeService.updateFilterSkinType(_id, req.body)
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_SKIN_TYPE_SUCCESS, result })
}

export const disableFilterHskSkinTypeController = async (
  req: Request<{ _id: string }, any, disableFilterHskSkinTypeReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const { state } = req.body
  const currentDate = new Date()
  const vietnamTimezoneOffset = 7 * 60
  const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

  const result = await databaseService.filterHskSkinType.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: { state, updated_at: localTime } },
    { returnDocument: 'after' }
  )
  res.json({ message: ADMIN_MESSAGES.UPDATE_FILTER_SKIN_TYPE_STATE_SUCCESS, data: result })
}

export const searchFilterHskSkinTypesController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.query
  const filter: Filter<FilterHskSkinType> = {}
  if (keyword) {
    filter.option_name = { $regex: keyword as string, $options: 'i' }
  }
  await sendPaginatedResponse(res, next, databaseService.filterHskSkinType, req.query, filter)
}

export const getActiveFilterHskSkinTypesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databaseService.filterHskSkinType.find({ state: GenericFilterState.ACTIVE }).toArray();
    res.json({
      message: ADMIN_MESSAGES.GET_ACTIVE_FILTER_SKIN_TYPES_SUCCESSFULLY,
      data: result
    });
  } catch (error) {
    next(error);
  }
};