import { ObjectId } from 'mongodb'

interface FilterHskUsesType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
}

export default class FilterHskUses {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string

  constructor(filterHskUses: FilterHskUsesType) {
    this._id = filterHskUses._id || new ObjectId()
    this.option_name = filterHskUses.option_name || ''
    this.category_name = filterHskUses.category_name || ''
    this.category_param = filterHskUses.category_param || ''
  }
}
