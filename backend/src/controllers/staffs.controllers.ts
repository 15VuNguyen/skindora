import { sendPaginatedResponse } from '~/utils/pagination.helper'
import { Request, Response, NextFunction } from 'express'
import databaseService from '~/services/database.services'
import { Filter, ObjectId } from 'mongodb'
import Product from '~/models/schemas/Product.schema'

export const staffGetAllProductController = async (req: Request, res: Response, next: NextFunction) => {
  const projection = {
    // _id: 0,
    updated_at: 0
  }
  const filter: Filter<Product> = {}
  const filterFields = [
    'filter_brand',
    'filter_dac_tinh',
    'filter_hsk_ingredients',
    'filter_hsk_product_type',
    'filter_hsk_size',
    'filter_hsk_skin_type',
    'filter_hsk_uses',
    'filter_origin'
  ]
  filterFields.forEach((field) => {
    if (req.query[field]) {
      //Gán giá trị filter vào object, chuyển đổi sang ObjectId
      filter[field as keyof Filter<Product>] = new ObjectId(req.query[field] as string)
    }
  })

  //Thêm logic tìm kiếm theo tên nếu có keyword
  if (req.query.keyword) {
    filter.name_on_list = {
      $regex: req.query.keyword as string,
      $options: 'i'
    }
  }
  await sendPaginatedResponse(res, next, databaseService.products, req.query, filter, projection)
}
