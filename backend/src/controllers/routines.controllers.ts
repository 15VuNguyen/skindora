import { Request, Response } from 'express'
import { ROUTINE_MESSAGES } from '~/constants/messages'
import { RoutinePayload } from '~/models/requests/Routines.requests'
import { TokenPayLoad } from '~/models/requests/Users.requests'
import routineService from '~/services/routines.services'

export const createOrUpdateUserRoutineController = async (
  req: Request<any, any, RoutinePayload>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const payload = req.body

  const result = await routineService.createOrUpdateUserRoutine(user_id, payload)

    res.json({
    message: ROUTINE_MESSAGES.SAVE_ROUTINE_SUCCESS,
    result
  })
}