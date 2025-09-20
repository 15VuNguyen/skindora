import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ROUTINE_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const VALID_TIMES = ['AM', 'PM']

export const createOrUpdateRoutineValidator = validate(
  checkSchema(
    {
      startDate: {
        notEmpty: { errorMessage: ROUTINE_MESSAGES.START_DATE_REQUIRED },
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: ROUTINE_MESSAGES.INVALID_DATE_FORMAT
        }
      },
      endDate: {
        notEmpty: { errorMessage: ROUTINE_MESSAGES.END_DATE_REQUIRED },
        isISO8601: {
          options: { strict: true, strictSeparator: true },
          errorMessage: ROUTINE_MESSAGES.INVALID_DATE_FORMAT
        },
        custom: {
          options: (value, { req }) => {
            if (new Date(value) <= new Date(req.body.startDate)) {
              throw new Error(ROUTINE_MESSAGES.END_DATE_MUST_BE_AFTER_START_DATE)
            }
            return true
          }
        }
      },
      schedule: {
        notEmpty: { errorMessage: ROUTINE_MESSAGES.SCHEDULE_REQUIRED },
        isObject: { errorMessage: ROUTINE_MESSAGES.SCHEDULE_MUST_BE_OBJECT },
        custom: {
          options: (value) => {
            for (const day in value) {
              if (!VALID_DAYS.includes(day)) {
                throw new Error(`${ROUTINE_MESSAGES.INVALID_SCHEDULE_DAY}: ${day}`)
              }
              const daySchedule = value[day]
              if (typeof daySchedule !== 'object' || daySchedule === null) {
                throw new Error(`Schedule for ${day} must be an object.`)
              }
              for (const time in daySchedule) {
                if (!VALID_TIMES.includes(time)) {
                  throw new Error(`${ROUTINE_MESSAGES.INVALID_SCHEDULE_TIME} on ${day}`)
                }
                const productIds = daySchedule[time]
                if (!Array.isArray(productIds)) {
                  throw new Error(`Product list for ${day} at ${time} must be an array.`)
                }
                for (const id of productIds) {
                  if (!ObjectId.isValid(id)) {
                    throw new Error(`${ROUTINE_MESSAGES.INVALID_PRODUCT_ID_IN_SCHEDULE}: ${id}`)
                  }
                }
              }
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
