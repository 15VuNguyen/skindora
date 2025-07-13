import databaseService from '~/services/database.services'
import { Request, Response, NextFunction } from 'express'
import { sendPaginatedResponse } from '~/utils/pagination.helper'
import { ParamsDictionary } from 'express-serve-static-core'
import { disableFilterBrandReqBody, updateFilterBrandReqBody } from '~/models/requests/Admin.requests'
import filterBrandService from '~/services/filterBrand.services'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { Filter, ObjectId } from 'mongodb'
import FilterBrand from '~/models/schemas/FilterBrand.schema'
import { FilterBrandState } from '~/constants/enums'

export const getAllFilterBrandsController = async (req: Request, res: Response, next: NextFunction) => {
  await sendPaginatedResponse(res, next, databaseService.filterBrand, req.query)
}

export const updateFilterBrandController = async (
  req: Request<ParamsDictionary, any, updateFilterBrandReqBody>,
  res: Response
) => {
  try {
    const { _id } = req.params
    const result = await filterBrandService.updateFilterBrand(_id, req.body)
    if (!result) {
      res.status(404).json({
        message: ADMIN_MESSAGES.FILTER_BRAND_NOT_FOUND
      })
    }
    res.json({
      message: ADMIN_MESSAGES.UPDATE_FILTER_BRAND_SUCCESS,
      result
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: ADMIN_MESSAGES.UPDATE_FILTER_BRAND_FAILED,
        error: error.message
      })
    } else {
      res.status(500).json({
        message: ADMIN_MESSAGES.UPDATE_FILTER_BRAND_FAILED,
        error: 'An unexpected error occurred'
      })
    }
  }
}

export const disableFilterBrandController = async (
  req: Request<ParamsDictionary, any, disableFilterBrandReqBody>,
  res: Response
) => {
  const { _id } = req.params
  const { state } = req.body

  const result = await databaseService.filterBrand.findOneAndUpdate(
    { _id: new ObjectId(_id) },
    {
      $set: {
        state,
        updated_at: new Date()
      }
    },
    { returnDocument: 'after' }
  )

  res.json({
    message: ADMIN_MESSAGES.UPDATE_FILTER_BRAND_STATE_SUCCESS,
    data: result
  })
}

export const getFilterBrandByIdController = async (req: Request<{ _id: string }>, res: Response) => {
  const { _id } = req.params

  const filterBrand = await databaseService.filterBrand.findOne({
    _id: new ObjectId(_id)
  })

  if (!filterBrand) {
    res.status(404).json({ message: ADMIN_MESSAGES.FILTER_BRAND_NOT_FOUND })
  }
  res.json({ data: filterBrand })
}

export const searchFilterBrandsController = async (req: Request, res: Response, next: NextFunction) => {
  const { keyword } = req.query
  const filter: Filter<FilterBrand> = {}

  if (keyword) {
    filter.option_name = {
      $regex: keyword as string,
      $options: 'i'
    }
  }

  await sendPaginatedResponse(res, next, databaseService.filterBrand, req.query, filter)
}

export const getActiveFilterBrandsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeStates = [
      FilterBrandState.ACTIVE,
      FilterBrandState.COLLABORATION,
      FilterBrandState.PARTNERSHIP,
      FilterBrandState.EXCLUSIVE,
      FilterBrandState.LIMITED_EDITION
    ];
    const result = await databaseService.filterBrand.find({ state: { $in: activeStates } }).toArray();
    res.json({
      message: ADMIN_MESSAGES.GET_ACTIVE_FILTER_BRANDS_SUCCESSFULLY,
      data: result
    });
  } catch (error) {
    next(error);
  }
};