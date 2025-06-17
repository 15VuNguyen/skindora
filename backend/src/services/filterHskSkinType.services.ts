import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

class FilterHskSkinTypeService {
  async checkSkinTypeIdExist(filter_hsk_skin_type: string): Promise<boolean> {
    const skinType = await databaseService.filterHskSkinType.findOne({
      _id: new ObjectId(filter_hsk_skin_type)
    })
    return Boolean(skinType)
  }
}
const filterHskSkinTypeService = new FilterHskSkinTypeService()
export default filterHskSkinTypeService
