import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'

class FilterHskProductTypeService {
  async checkProductTypeIdExist(filter_hsk_product_type: string): Promise<boolean> {
    const productType = await databaseService.filterHskProductType.findOne({
      _id: new ObjectId(filter_hsk_product_type)
    })
    return Boolean(productType)
  }
}
const filterHskProductTypeService = new FilterHskProductTypeService()
export default filterHskProductTypeService
