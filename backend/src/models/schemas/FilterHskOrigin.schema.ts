import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'

interface FilterOriginType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date
}

export default class FilterOrigin {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date

  constructor(filterOrigin: FilterOriginType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterOrigin._id || new ObjectId()
    this.option_name = filterOrigin.option_name || ''
    this.category_name = filterOrigin.category_name || ''
    this.category_param = filterOrigin.category_param || ''
    this.state = filterOrigin.state || GenericFilterState.ACTIVE
    this.created_at = filterOrigin.created_at || localTime
    this.updated_at = filterOrigin.updated_at || localTime
  }
}
