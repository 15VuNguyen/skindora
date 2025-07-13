import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { createNewFilterHskOriginReqBody, updateFilterHskOriginReqBody } from '~/models/requests/Admin.requests'
import FilterOrigin from '~/models/schemas/FilterHskOrigin.schema'
import databaseService from '~/services/database.services'

class FilterOriginService {
  async checkOriginIdExist(filter_origin: string): Promise<boolean> {
    const origin = await databaseService.filterOrigin.findOne({
      _id: new ObjectId(filter_origin)
    })
    return Boolean(origin)
  }

  async createNewFilterOrigin(payload: createNewFilterHskOriginReqBody) {
    const filterID = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.filterOrigin.insertOne(
      new FilterOrigin({
        ...payload,
        _id: filterID,
        state: payload.state || GenericFilterState.ACTIVE,
        created_at: localTime,
        updated_at: localTime
      })
    )
    return result
  }

  async updateFilterOrigin(_id: string, payload: updateFilterHskOriginReqBody) {
    try {
      const currentDate = new Date()
      const vietnamTimezoneOffset = 7 * 60
      const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

      const result = await databaseService.filterOrigin.findOneAndUpdate(
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
        message: ADMIN_MESSAGES.UPDATE_FILTER_ORIGIN_FAILED,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}
const filterOriginService = new FilterOriginService()
export default filterOriginService
