import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

class FilterHskUsesService {
  async checkUsesIdExist(filter_hsk_uses: string): Promise<boolean> {
    const uses = await databaseService.filterHskUses.findOne({
      _id: new ObjectId(filter_hsk_uses)
    })
    return Boolean(uses)
  }
}
const filterHskUsesService = new FilterHskUsesService()
export default filterHskUsesService
