import { ObjectId } from 'mongodb'
import { getLocalTime } from '~/utils/date'

type ScheduleMap = Map<string, Map<'AM' | 'PM', string[]>>

interface UserRoutineType {
  _id?: ObjectId
  user_id: ObjectId
  start_date: Date
  end_date: Date
  schedule: ScheduleMap
  created_at?: Date
  updated_at?: Date
}

export default class UserRoutine {
  _id?: ObjectId
  user_id: ObjectId
  start_date: Date
  end_date: Date
  schedule: ScheduleMap
  created_at: Date
  updated_at: Date

  constructor(routine: UserRoutineType) {
    this._id = routine._id || new ObjectId()
    this.user_id = routine.user_id
    this.start_date = routine.start_date
    this.end_date = routine.end_date
    this.schedule = routine.schedule
    this.created_at = routine.created_at || getLocalTime()
    this.updated_at = routine.updated_at || getLocalTime()
  }
}
