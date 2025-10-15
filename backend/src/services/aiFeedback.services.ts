import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import AIFeedback from '~/models/schemas/AIFeedback.schema'
import { AIFeedbackFeature } from '~/models/requests/Ai.requests'

class AIFeedbackService {
  async createFeedback({
    feature,
    rating,
    comment,
    interactionId,
    userId
  }: {
    feature: AIFeedbackFeature
    rating: number
    comment?: string
    interactionId?: string
    userId?: string
  }) {
    const feedback = new AIFeedback({
      feature,
      rating,
      comment,
      interactionId,
      userId: userId ? new ObjectId(userId) : undefined
    })

    await databaseService.aiFeedbacks.insertOne(feedback)
    return feedback
  }

  async getFeedbackSummary(feature?: AIFeedbackFeature) {
    const pipeline: Record<string, unknown>[] = []
    if (feature) {
      pipeline.push({ $match: { feature } })
    }
    pipeline.push({
      $group: {
        _id: '$feature',
        averageRating: { $avg: '$rating' },
        total: { $sum: 1 }
      }
    })

    const stats = await databaseService.aiFeedbacks
      .aggregate<{
        _id: AIFeedbackFeature
        averageRating: number
        total: number
      }>(pipeline)
      .toArray()

    const summaries = new Map<
      AIFeedbackFeature,
      {
        feature: AIFeedbackFeature
        averageRating: number
        total: number
        recentComments: Array<{ rating: number; comment: string; created_at: Date }>
      }
    >()

    stats.forEach((item) => {
      const roundedAverage = Number(item.averageRating?.toFixed(2)) || 0
      summaries.set(item._id, {
        feature: item._id,
        averageRating: roundedAverage,
        total: item.total,
        recentComments: []
      })
    })

    const commentFilter: Record<string, unknown> = { comment: { $exists: true, $ne: '' } }
    if (feature) {
      commentFilter.feature = feature
    }

    const recentComments = await databaseService.aiFeedbacks
      .find(commentFilter, {
        projection: {
          feature: 1,
          rating: 1,
          comment: 1,
          created_at: 1
        }
      })
      .sort({ created_at: -1 })
      .limit(5)
      .toArray()

    recentComments.forEach((entry) => {
      if (!entry.comment) return
      const summary =
        summaries.get(entry.feature) ||
        summaries
          .set(entry.feature, {
            feature: entry.feature,
            averageRating: 0,
            total: 0,
            recentComments: []
          })
          .get(entry.feature)!
      summary.recentComments.push({
        rating: entry.rating,
        comment: entry.comment,
        created_at: entry.created_at
      })
    })

    const ensuredFeatures: AIFeedbackFeature[] = feature ? [feature] : ['skincare_analysis', 'expert_chat']
    ensuredFeatures.forEach((item) => {
      if (!summaries.has(item)) {
        summaries.set(item, {
          feature: item,
          averageRating: 0,
          total: 0,
          recentComments: []
        })
      }
    })

    if (feature) {
      const summary =
        summaries.get(feature) ||
        ({
          feature,
          averageRating: 0,
          total: 0,
          recentComments: []
        } as const)
      return summary
    }

    return Array.from(summaries.values())
  }
}

const aiFeedbackService = new AIFeedbackService()
export default aiFeedbackService
