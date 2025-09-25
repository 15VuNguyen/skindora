import { ObjectId } from 'mongodb'

interface AIUsageType {
  _id?: ObjectId
  date: string // YYYY-MM-DD
  count: number
  created_at?: Date
  updated_at?: Date
}

export default class AIUsage {
  _id?: ObjectId
  date: string
  count: number
  created_at: Date
  updated_at: Date

  constructor(usage: AIUsageType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = usage._id || new ObjectId()
    this.date = usage.date
    this.count = usage.count
    this.created_at = usage.created_at || localTime
    this.updated_at = usage.updated_at || localTime
  }
}
