import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

class FilterHskIngredientService {
  async checkIngredientIdExist(filter_hsk_ingredients: string): Promise<boolean> {
    const ingredient = await databaseService.filterHskIngredient.findOne({
      _id: new ObjectId(filter_hsk_ingredients)
    })
    return Boolean(ingredient)
  }
}
const filterHskIngredientService = new FilterHskIngredientService()
export default filterHskIngredientService
