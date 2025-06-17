import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

class FilterBrandService {
  async checkBrandIdExist(filter_brand: string): Promise<boolean> {
    const brand = await databaseService.filterBrand.findOne({
      _id: new ObjectId(filter_brand)
    })
    return Boolean(brand)
  }
}

const filterBrandService = new FilterBrandService()
export default filterBrandService
