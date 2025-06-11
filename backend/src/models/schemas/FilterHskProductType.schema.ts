import { ObjectId } from 'mongodb'

interface FilterHskProductTypeType {
  _id?: ObjectId
  option_name?: string
  description?: string
  category_name?: string
  category_param?: string
}

export default class FilterHskProductType {
  _id?: ObjectId
  option_name?: string
  description?: string
  category_name?: string
  category_param?: string

  constructor(filterHskProductType: FilterHskProductTypeType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterHskProductType._id || new ObjectId()
    this.option_name = filterHskProductType.option_name || ''
    this.description = filterHskProductType.description || ''
    this.category_name = filterHskProductType.category_name || ''
    this.category_param = filterHskProductType.category_param || ''
  }
}
