import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

class FilterOriginService {
  async checkOriginIdExist(filter_origin: string): Promise<boolean> {
    const origin = await databaseService.filterOrigin.findOne({
      _id: new ObjectId(filter_origin)
    })
    return Boolean(origin)
  }
}
const filterOriginService = new FilterOriginService()
export default filterOriginService
