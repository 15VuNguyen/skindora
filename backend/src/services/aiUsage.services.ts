import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import AIUsage from '~/models/schemas/AIUsage.schema'

class AIUsageService {
  async incrementUsage() {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    const existingUsage = await databaseService.aiUsages.findOne({ date: today })

    if (existingUsage) {
      await databaseService.aiUsages.updateOne(
        { _id: existingUsage._id },
        { $inc: { count: 1 }, $set: { updated_at: new Date() } }
      )
    } else {
      const newUsage = new AIUsage({
        date: today,
        count: 1
      })
      await databaseService.aiUsages.insertOne(newUsage)
    }
  }

  async getTotalUsage() {
    const usages = await databaseService.aiUsages.find({}).toArray()
    return usages.reduce((total, usage) => total + usage.count, 0)
  }

  async getDailyUsage() {
    return await databaseService.aiUsages.find({}).sort({ date: -1 }).toArray()
  }
}

const aiUsageService = new AIUsageService()
export default aiUsageService
