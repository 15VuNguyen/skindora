import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'

interface FilterHskIngredientType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date
}

export default class FilterHskIngredient {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date

  constructor(filterHskIngredient: FilterHskIngredientType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterHskIngredient._id || new ObjectId()
    this.option_name = filterHskIngredient.option_name || ''
    this.category_name = filterHskIngredient.category_name || ''
    this.category_param = filterHskIngredient.category_param || ''
    this.state = filterHskIngredient.state || GenericFilterState.ACTIVE
    this.created_at = filterHskIngredient.created_at || localTime
    this.updated_at = filterHskIngredient.updated_at || localTime
  }
}
