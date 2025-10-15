import { ObjectId } from 'mongodb'

export type AIFeedbackFeature = 'skincare_analysis' | 'expert_chat'

interface AIFeedbackType {
  _id?: ObjectId
  feature: AIFeedbackFeature
  rating: number
  comment?: string
  interactionId?: string
  userId?: ObjectId
  created_at?: Date
  updated_at?: Date
}

export default class AIFeedback {
  _id: ObjectId
  feature: AIFeedbackFeature
  rating: number
  comment?: string
  interactionId?: string
  userId?: ObjectId
  created_at: Date
  updated_at: Date

  constructor(feedback: AIFeedbackType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = feedback._id || new ObjectId()
    this.feature = feedback.feature
    this.rating = feedback.rating
    this.comment = feedback.comment
    this.interactionId = feedback.interactionId
    this.userId = feedback.userId
    this.created_at = feedback.created_at || localTime
    this.updated_at = feedback.updated_at || localTime
  }
}
