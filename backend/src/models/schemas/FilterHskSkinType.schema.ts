import { ObjectId } from 'mongodb'
import { GenericFilterState } from '~/constants/enums'

interface FilterHskSkinTypeType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date
}

export default class FilterHskSkinType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: GenericFilterState
  created_at?: Date
  updated_at?: Date

  constructor(filterHskSkinType: FilterHskSkinTypeType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterHskSkinType._id || new ObjectId()
    this.option_name = filterHskSkinType.option_name || ''
    this.category_name = filterHskSkinType.category_name || ''
    this.category_param = filterHskSkinType.category_param || ''
    this.state = filterHskSkinType.state || GenericFilterState.ACTIVE
    this.created_at = filterHskSkinType.created_at || localTime
    this.updated_at = filterHskSkinType.updated_at || localTime
  }
}
