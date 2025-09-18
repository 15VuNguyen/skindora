import { ObjectId } from 'mongodb'
import { RoutinePayload } from '~/models/requests/Routines.requests'
import UserRoutine from '~/models/schemas/UserRoutine.schema'
import databaseService from './database.services'
import { getLocalTime } from '~/utils/date'

class RoutineService {
  public async createOrUpdateUserRoutine(user_id: string, payload: RoutinePayload) {
    const { startDate, endDate, schedule } = payload

    const result = await databaseService.userRoutines.findOneAndUpdate(
      { user_id: new ObjectId(user_id) },
      {
        $set: {
          start_date: new Date(startDate),
          end_date: new Date(endDate),
          schedule: schedule,
          updated_at: getLocalTime()
        },
        $setOnInsert: {
          _id: new ObjectId(),
          user_id: new ObjectId(user_id),
          created_at: getLocalTime()
        }
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return result
  }
}

const routineService = new RoutineService()
export default routineService
