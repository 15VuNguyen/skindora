import { ObjectId } from 'mongodb'

interface FilterOriginType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
}

export default class FilterOrigin {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string

  constructor(filterOrigin: FilterOriginType) {
    this._id = filterOrigin._id || new ObjectId()
    this.option_name = filterOrigin.option_name || ''
    this.category_name = filterOrigin.category_name || ''
    this.category_param = filterOrigin.category_param || ''
  }
}
