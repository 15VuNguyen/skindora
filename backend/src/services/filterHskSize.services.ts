import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

class FilterHskSizeService {
  async checkSizeIdExist(filter_hsk_size: string): Promise<boolean> {
    const size = await databaseService.filterHskSize.findOne({
      _id: new ObjectId(filter_hsk_size)
    })
    return Boolean(size)
  }
}
const filterHskSizeService = new FilterHskSizeService()
export default filterHskSizeService
