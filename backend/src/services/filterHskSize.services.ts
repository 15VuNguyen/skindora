import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { createNewFilterHskSizeReqBody, updateFilterHskSizeReqBody } from '~/models/requests/Admin.requests'
import FilterHskSize from '~/models/schemas/FilterHskSize.schema'
import databaseService from '~/services/database.services'

class FilterHskSizeService {
  async checkSizeIdExist(filter_hsk_size: string): Promise<boolean> {
    const size = await databaseService.filterHskSize.findOne({
      _id: new ObjectId(filter_hsk_size)
    })
    return Boolean(size)
  }

  async createNewFilterSize(payload: createNewFilterHskSizeReqBody) {
    const filterID = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.filterHskSize.insertOne(
      new FilterHskSize({
        ...payload,
        _id: filterID,
        state: payload.state || GenericFilterState.ACTIVE,
        created_at: localTime,
        updated_at: localTime
      })
    )
    return result
  }

  async updateFilterSize(_id: string, payload: updateFilterHskSizeReqBody) {
    try {
      const currentDate = new Date()
      const vietnamTimezoneOffset = 7 * 60
      const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

      const result = await databaseService.filterHskSize.findOneAndUpdate(
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
        message: ADMIN_MESSAGES.UPDATE_FILTER_SIZE_FAILED,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}
const filterHskSizeService = new FilterHskSizeService()
export default filterHskSizeService
