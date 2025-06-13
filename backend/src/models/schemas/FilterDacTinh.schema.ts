import { ObjectId } from 'mongodb'

interface FilterDacTinhType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
}

export default class FilterDacTinh {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string

  constructor(filterDacTinh: FilterDacTinhType) {
    this._id = filterDacTinh._id || new ObjectId()
    this.option_name = filterDacTinh.option_name || ''
    this.category_name = filterDacTinh.category_name || ''
    this.category_param = filterDacTinh.category_param || ''
  }
}
