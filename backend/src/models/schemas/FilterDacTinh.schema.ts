import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'

interface FilterDacTinhType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date
}

export default class FilterDacTinh {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date

  constructor(filterDacTinh: FilterDacTinhType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterDacTinh._id || new ObjectId()
    this.option_name = filterDacTinh.option_name || ''
    this.category_name = filterDacTinh.category_name || ''
    this.category_param = filterDacTinh.category_param || ''
    this.state = filterDacTinh.state || GenericFilterState.ACTIVE
    this.created_at = filterDacTinh.created_at || localTime
    this.updated_at = filterDacTinh.updated_at || localTime
  }
}
