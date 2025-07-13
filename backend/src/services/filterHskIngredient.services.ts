import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { createNewFilterHskIngredientReqBody, updateFilterHskIngredientReqBody } from '~/models/requests/Admin.requests'
import FilterHskIngredient from '~/models/schemas/FilterHskIngredient.schema'
import databaseService from '~/services/database.services'

class FilterHskIngredientService {
  async checkIngredientIdExist(filter_hsk_ingredients: string): Promise<boolean> {
    const ingredient = await databaseService.filterHskIngredient.findOne({
      _id: new ObjectId(filter_hsk_ingredients)
    })
    return Boolean(ingredient)
  }

  async createNewFilterIngredient(payload: createNewFilterHskIngredientReqBody) {
    const filterID = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.filterHskIngredient.insertOne(
      new FilterHskIngredient({
        ...payload,
        _id: filterID,
        state: payload.state || GenericFilterState.ACTIVE,
        created_at: localTime,
        updated_at: localTime
      })
    )
    return result
  }

  async updateFilterIngredient(_id: string, payload: updateFilterHskIngredientReqBody) {
    try {
      const currentDate = new Date()
      const vietnamTimezoneOffset = 7 * 60
      const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

      const result = await databaseService.filterHskIngredient.findOneAndUpdate(
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
        message: ADMIN_MESSAGES.UPDATE_FILTER_INGREDIENT_FAILED,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}
const filterHskIngredientService = new FilterHskIngredientService()
export default filterHskIngredientService
