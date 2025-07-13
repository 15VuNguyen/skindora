import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import databaseService from '~/services/database.services'
import {
  createNewFilterHskIngredientReqBody,
  disableFilterHskIngredientReqBody,
  updateFilterHskIngredientReqBody
} from '~/models/requests/Admin.requests'
import filterHskIngredientService from '~/services/filterHskIngredient.services'
import { ObjectId } from 'mongodb'
import { getLocalTime } from '~/utils/date'
import { Filter } from 'mongodb'
import FilterHskIngredient from '~/models/schemas/FilterHskIngredient.schema'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { GenericFilterState } from '~/constants/enums'

export const getAllFilterHskIngredientsController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.filterHskIngredient, req.query)
}

export const createNewFilterHskIngredientController = async (
  req: Request<ParamsDictionary, any, createNewFilterHskIngredientReqBody>,
  res: Response
) => {
  const result = await filterHskIngredientService.createNewFilterIngredient(req.body)
  res.json({
    message: ADMIN_MESSAGES.CREATE_NEW_FILTER_INGREDIENT_SUCCESS,
    result
  })
}

export const getFilterHskIngredientByIdController = async (req: Request<{ _id: string }>, res: Response) => {
  const { _id } = req.params
  const result = await databaseService.filterHskIngredient.findOne({ _id: new ObjectId(_id) })
  if (!result) {
    res.status(404).json({
      message: ADMIN_MESSAGES.FILTER_INGREDIENT_NOT_FOUND
    })
  }
  res.json({ data: result })
}

export const updateFilterHskIngredientController = async (
  req: Request<{ _id: string }, any, updateFilterHskIngredientReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const result = await filterHskIngredientService.updateFilterIngredient(_id, req.body)
  res.json({
    message: ADMIN_MESSAGES.UPDATE_FILTER_INGREDIENT_SUCCESS,
    result
  })
}

export const disableFilterHskIngredientController = async (
  req: Request<{ _id: string }, any, disableFilterHskIngredientReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const { state } = req.body
  const currentDate = new Date()
  const vietnamTimezoneOffset = 7 * 60
  const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

  const result = await databaseService.filterHskIngredient.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    { $set: { state, updated_at: localTime } },
    { returnDocument: 'after' }
  )
  res.json({
    message: ADMIN_MESSAGES.UPDATE_FILTER_INGREDIENT_STATE_SUCCESS,
    data: result
  })
}

export const searchFilterHskIngredientsController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.query
  const filter: Filter<FilterHskIngredient> = {}
  if (keyword) {
    filter.option_name = { $regex: keyword as string, $options: 'i' }
  }
  await sendPaginatedResponse(res, next, databaseService.filterHskIngredient, req.query, filter)
}

export const getActiveFilterHskIngredientsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await databaseService.filterHskIngredient.find({ state: GenericFilterState.ACTIVE }).toArray()
    res.json({
      message: ADMIN_MESSAGES.GET_ACTIVE_FILTER_INGREDIENTS_SUCCESSFULLY,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
