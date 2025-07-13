import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { createNewFilterHskSkinTypeReqBody, updateFilterHskSkinTypeReqBody } from '~/models/requests/Admin.requests'
import FilterHskSkinType from '~/models/schemas/FilterHskSkinType.schema'
import databaseService from '~/services/database.services'

class FilterHskSkinTypeService {
  async checkSkinTypeIdExist(filter_hsk_skin_type: string): Promise<boolean> {
    const skinType = await databaseService.filterHskSkinType.findOne({
      _id: new ObjectId(filter_hsk_skin_type)
    })
    return Boolean(skinType)
  }

  async createNewFilterSkinType(payload: createNewFilterHskSkinTypeReqBody) {
    const filterID = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.filterHskSkinType.insertOne(
      new FilterHskSkinType({
        ...payload,
        _id: filterID,
        state: payload.state || GenericFilterState.ACTIVE,
        created_at: localTime,
        updated_at: localTime
      })
    )
    return result
  }

  async updateFilterSkinType(_id: string, payload: updateFilterHskSkinTypeReqBody) {
    try {
      const currentDate = new Date()
      const vietnamTimezoneOffset = 7 * 60
      const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

      const result = await databaseService.filterHskSkinType.findOneAndUpdate(
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
        message: ADMIN_MESSAGES.UPDATE_FILTER_SKIN_TYPE_FAILED,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}
const filterHskSkinTypeService = new FilterHskSkinTypeService()
export default filterHskSkinTypeService
