import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import databaseService from '~/services/database.services'
import {
  createNewFilterDacTinhReqBody,
  disableFilterDacTinhReqBody,
  updateFilterDacTinhReqBody
} from '~/models/requests/Admin.requests'
import filterDacTinhService from '~/services/filterDacTinh.services'
import { Filter, ObjectId } from 'mongodb'
import { ADMIN_MESSAGES } from '~/constants/messages'
import FilterDacTinh from '~/models/schemas/FilterDacTinh.schema'
import { GenericFilterState } from '~/constants/enums'

export const getAllFilterDacTinhsController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.filterDacTinh, req.query)
}

export const createNewFilterDacTinhController = async (
  req: Request<ParamsDictionary, any, createNewFilterDacTinhReqBody>,
  res: Response
) => {
  const result = await filterDacTinhService.createNewFilterDacTinh(req.body)
  res.json({
    message: ADMIN_MESSAGES.CREATE_NEW_FILTER_DAC_TINH_SUCCESS,
    result
  })
}

export const getFilterDacTinhByIdController = async (req: Request<{ _id: string }>, res: Response) => {
  const { _id } = req.params
  const filterDacTinh = await databaseService.filterDacTinh.findOne({
    _id: new ObjectId(_id)
  })
  if (!filterDacTinh) {
    res.status(404).json({
      message: ADMIN_MESSAGES.FILTER_DAC_TINH_NOT_FOUND
    })
  }
  res.json({ data: filterDacTinh })
}

export const updateFilterDacTinhController = async (
  req: Request<{ _id: string }, any, updateFilterDacTinhReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const result = await filterDacTinhService.updateFilterDacTinh(_id, req.body)
  res.json({
    message: ADMIN_MESSAGES.UPDATE_FILTER_DAC_TINH_SUCCESS,
    result
  })
}

export const disableFilterDacTinhController = async (
  req: Request<{ _id: string }, any, disableFilterDacTinhReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const { state } = req.body
  const currentDate = new Date()
  const vietnamTimezoneOffset = 7 * 60
  const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

  const result = await databaseService.filterDacTinh.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    {
      $set: {
        state,
        updated_at: localTime
      }
    },
    { returnDocument: 'after' }
  )

  res.json({
    message: ADMIN_MESSAGES.UPDATE_FILTER_DAC_TINH_STATE_SUCCESS,
    data: result
  })
}

export const searchFilterDacTinhsController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.query
  const filter: Filter<FilterDacTinh> = {}

  if (keyword) {
    filter.option_name = {
      $regex: keyword as string,
      $options: 'i'
    }
  }

  await sendPaginatedResponse(res, next, databaseService.filterDacTinh, req.query, filter)
}

export const getActiveFilterDacTinhsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databaseService.filterDacTinh.find({ state: GenericFilterState.ACTIVE }).toArray()
    res.json({
      message: ADMIN_MESSAGES.GET_ACTIVE_FILTER_DAC_TINH_SUCCESSFULLY,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
