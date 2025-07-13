import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'

interface FilterHskSizeType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date
}

export default class FilterHskSize {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date

  constructor(filterHskSize: FilterHskSizeType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterHskSize._id || new ObjectId()
    this.option_name = filterHskSize.option_name || ''
    this.category_name = filterHskSize.category_name || ''
    this.category_param = filterHskSize.category_param || ''
    this.state = filterHskSize.state || GenericFilterState.ACTIVE
    this.created_at = filterHskSize.created_at || localTime
    this.updated_at = filterHskSize.updated_at || localTime
  }
}
