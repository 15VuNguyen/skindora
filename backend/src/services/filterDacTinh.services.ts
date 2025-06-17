import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

class FilterDacTinhService {
  async checkDacTinhIdExist(filter_dac_tinh: string): Promise<boolean> {
    const dacTinh = await databaseService.filterDacTinh.findOne({
      _id: new ObjectId(filter_dac_tinh)
    })
    return Boolean(dacTinh)
  }
}

const filterDacTinhService = new FilterDacTinhService()
export default filterDacTinhService
