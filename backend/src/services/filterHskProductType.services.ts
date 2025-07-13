import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { createNewFilterHskProductTypeReqBody, updateFilterHskProductTypeReqBody } from '~/models/requests/Admin.requests'
import FilterHskProductType from '~/models/schemas/FilterHskProductType.schema'
import databaseService from '~/services/database.services'

class FilterHskProductTypeService {
  async checkProductTypeIdExist(filter_hsk_product_type: string): Promise<boolean> {
    const productType = await databaseService.filterHskProductType.findOne({
      _id: new ObjectId(filter_hsk_product_type)
    })
    return Boolean(productType)
  }

  async createNewFilterProductType(payload: createNewFilterHskProductTypeReqBody) {
    const filterID = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.filterHskProductType.insertOne(
      new FilterHskProductType({
        ...payload,
        _id: filterID,
        state: payload.state || GenericFilterState.ACTIVE,
        created_at: localTime,
        updated_at: localTime
      })
    )
    return result
  }

  async updateFilterProductType(_id: string, payload: updateFilterHskProductTypeReqBody) {
    try {
      const currentDate = new Date()
      const vietnamTimezoneOffset = 7 * 60
      const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

      const result = await databaseService.filterHskProductType.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            ...payload,
            updated_at: localTime
          }
        },
        { returnDocument: 'after' }
      )
      return result
    } catch (error) {
      throw new ErrorWithStatus({
        message: ADMIN_MESSAGES.UPDATE_FILTER_PRODUCT_TYPE_FAILED,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}
const filterHskProductTypeService = new FilterHskProductTypeService()
export default filterHskProductTypeService
