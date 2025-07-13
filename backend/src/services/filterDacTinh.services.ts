import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { createNewFilterDacTinhReqBody, updateFilterDacTinhReqBody } from '~/models/requests/Admin.requests'
import FilterDacTinh from '~/models/schemas/FilterDacTinh.schema'
import databaseService from '~/services/database.services'

class FilterDacTinhService {
  async checkDacTinhIdExist(filter_dac_tinh: string): Promise<boolean> {
    const dacTinh = await databaseService.filterDacTinh.findOne({
      _id: new ObjectId(filter_dac_tinh)
    })
    return Boolean(dacTinh)
  }

  async createNewFilterDacTinh(payload: createNewFilterDacTinhReqBody) {
    const filterDacTinhID = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.filterDacTinh.insertOne(
      new FilterDacTinh({
        ...payload,
        _id: filterDacTinhID,
        state: payload.state || GenericFilterState.ACTIVE,
        created_at: localTime,
        updated_at: localTime
      })
    )
    return result
  }

  async updateFilterDacTinh(_id: string, payload: updateFilterDacTinhReqBody) {
    try {
      const currentDate = new Date()
      const vietnamTimezoneOffset = 7 * 60
      const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

      const result = await databaseService.filterDacTinh.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            ...payload,
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
        message: ADMIN_MESSAGES.UPDATE_FILTER_DAC_TINH_FAILED,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}

const filterDacTinhService = new FilterDacTinhService()
export default filterDacTinhService
