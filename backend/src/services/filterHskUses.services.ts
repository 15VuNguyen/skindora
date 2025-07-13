import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { createNewFilterHskUsesReqBody, updateFilterHskUsesReqBody } from '~/models/requests/Admin.requests'
import FilterHskUses from '~/models/schemas/FilterHskUses.schema'
import databaseService from '~/services/database.services'

class FilterHskUsesService {
  async checkUsesIdExist(filter_hsk_uses: string): Promise<boolean> {
    const uses = await databaseService.filterHskUses.findOne({
      _id: new ObjectId(filter_hsk_uses)
    })
    return Boolean(uses)
  }

  async createNewFilterUses(payload: createNewFilterHskUsesReqBody) {
    const filterID = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.filterHskUses.insertOne(
      new FilterHskUses({
        ...payload,
        _id: filterID,
        state: payload.state || GenericFilterState.ACTIVE,
        created_at: localTime,
        updated_at: localTime
      })
    )
    return result
  }

  async updateFilterUses(_id: string, payload: updateFilterHskUsesReqBody) {
    try {
      const currentDate = new Date()
      const vietnamTimezoneOffset = 7 * 60
      const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

      const result = await databaseService.filterHskUses.findOneAndUpdate(
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
        message: ADMIN_MESSAGES.UPDATE_FILTER_USES_FAILED,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}
const filterHskUsesService = new FilterHskUsesService()
export default filterHskUsesService
