import { ObjectId } from 'mongodb'

interface FilterHskSizeType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
}

export default class FilterHskSize {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string

  constructor(filterHskSize: FilterHskSizeType) {
    this._id = filterHskSize._id || new ObjectId()
    this.option_name = filterHskSize.option_name || ''
    this.category_name = filterHskSize.category_name || ''
    this.category_param = filterHskSize.category_param || ''
  }
}
