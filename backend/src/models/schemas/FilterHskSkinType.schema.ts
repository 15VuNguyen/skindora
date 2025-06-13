import { ObjectId } from 'mongodb'

interface FilterHskSkinTypeType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
}

export default class FilterHskSkinType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string

  constructor(filterHskSkinType: FilterHskSkinTypeType) {
    this._id = filterHskSkinType._id || new ObjectId()
    this.option_name = filterHskSkinType.option_name || ''
    this.category_name = filterHskSkinType.category_name || ''
    this.category_param = filterHskSkinType.category_param || ''
  }
}
