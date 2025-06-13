import { ObjectId } from 'mongodb'
import { FilterBrandState } from '~/constants/enums'

interface FilterBrandType {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: FilterBrandState
  created_at?: Date
  updated_at?: Date
}

export default class FilterBrand {
  _id?: ObjectId
  option_name?: string
  category_name?: string
  category_param?: string
  state?: FilterBrandState
  created_at?: Date
  updated_at?: Date

  constructor(filterBrand: FilterBrandType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = filterBrand._id || new ObjectId()
    this.option_name = filterBrand.option_name
    this.state = filterBrand.state || FilterBrandState.ACTIVE
    this.category_name = filterBrand.category_name || ''
    this.category_param = filterBrand.category_param || ''
    this.created_at = localTime || filterBrand.created_at
    this.updated_at = localTime || filterBrand.updated_at
  }
}
