import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'

interface FilterHskProductTypeType {
  _id?: ObjectId
  option_name?: string
  description?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date
}

export default class FilterHskProductType {
  _id?: ObjectId
  option_name?: string
  description?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date

  constructor(filterHskProductType: FilterHskProductTypeType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterHskProductType._id || new ObjectId()
    this.option_name = filterHskProductType.option_name || ''
    this.description = filterHskProductType.description || ''
    this.category_name = filterHskProductType.category_name || ''
    this.category_param = filterHskProductType.category_param || ''
    this.state = filterHskProductType.state || GenericFilterState.ACTIVE
    this.created_at = filterHskProductType.created_at || localTime
    this.updated_at = filterHskProductType.updated_at || localTime
  }
}
