import { ObjectId } from 'mongodb'

interface FilterHskIngredientType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
}

export default class FilterHskIngredient {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string

  constructor(filterHskIngredient: FilterHskIngredientType) {
    this._id = filterHskIngredient._id || new ObjectId()
    this.option_name = filterHskIngredient.option_name || ''
    this.category_name = filterHskIngredient.category_name || ''
    this.category_param = filterHskIngredient.category_param || ''
  }
}
