import { ObjectId } from 'mongodb'
import { FilterBrandState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { createNewFilterBrandReqBody, updateFilterBrandReqBody } from '~/models/requests/Admin.requests'
import FilterBrand from '~/models/schemas/FilterBrand.schema'
import databaseService from '~/services/database.services'

class FilterBrandService {
  async checkBrandIdExist(filter_brand: string): Promise<boolean> {
    const brand = await databaseService.filterBrand.findOne({
      _id: new ObjectId(filter_brand)
    })
    return Boolean(brand)
  }

  async createNewFilterBrand(payload: createNewFilterBrandReqBody) {
    const filterBrandID = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.filterBrand.insertOne(
      new FilterBrand({
        ...payload,
        _id: filterBrandID,
        state: payload.state || FilterBrandState.ACTIVE,
        created_at: localTime,
        updated_at: localTime
      })
    )
    console.log(payload)
    console.log(result)
    return result
  }

  async updateFilterBrand(_id: string, payload: updateFilterBrandReqBody) {
    try {
      const updatedPayload = { ...payload }
      const currentDate = new Date()
      const vietnamTimezoneOffset = 7 * 60
      const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)
      const result = await databaseService.filterBrand.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            ...updatedPayload,
            updated_at: localTime
          }
        },
        {
          returnDocument: 'after'
        }
      )
      return result
    } catch (error) {
      throw new ErrorWithStatus({
        message: ADMIN_MESSAGES.UPDATE_FILTER_BRAND_FAILED,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}
const filterBrandService = new FilterBrandService()
export default filterBrandService
