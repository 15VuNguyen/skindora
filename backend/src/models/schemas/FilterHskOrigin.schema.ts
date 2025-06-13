import { ObjectId } from 'mongodb'

interface FilterHskOriginType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
}

export default class FilterHskOrigin {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string

  constructor(filterHskOrigin: FilterHskOriginType) {
    this._id = filterHskOrigin._id || new ObjectId()
    this.option_name = filterHskOrigin.option_name || ''
    this.category_name = filterHskOrigin.category_name || ''
    this.category_param = filterHskOrigin.category_param || ''
  }
}
