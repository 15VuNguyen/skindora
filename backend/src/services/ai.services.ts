import { ObjectId } from 'mongodb'
import { getLocalTime } from '~/utils/date'
import {
  APPROX_USD_TO_VND_RATE,
  KNOWN_SKIN_CONCERNS,
  USER_BUDGET_USD as DEFAULT_BUDGET_USD,
  USER_SCHEDULE_PREFERENCE as DEFAULT_SCHEDULE
} from '~/constants/ai.constants'
import { MODEL_NAME } from '~/constants/config'
import { ErrorWithStatus } from '~/models/Errors'
import { SkincareAdvisorRequestBody } from '~/models/requests/Ai.requests'
import { AiSuggestedFilterCriteria, DetailTextHtml, MongoProduct } from '~/models/types/Ai.types'
import { applyClientSideFilters } from '~/utils/ai/clientFiltering'
import {
  createDiagnosisPrompt,
  createFilterSuggestionPrompt,
  createFullRoutineRecommendationJsonPrompt,
  createRoutineSelectionPrompt,
  createWeeklyScheduleGenerationPrompt
} from '~/utils/ai/prompts/prompts'
import { getAICompletion } from '~/utils/ai/aiService'
import { transformMongoToAISchema } from '~/utils/ai/transform'
import databaseService from '~/services/database.services'
import logger from '~/utils/logger'

class SkincareAdvisorService {
  private async _findFilterObjectIdByName(filterName: string, collectionName: string): Promise<string | null> {
    if (!filterName || !collectionName) return null
    try {
      const collection = databaseService.collection(collectionName)
      const filterDoc = await collection.findOne({ option_name: filterName })
      if (filterDoc?._id) {
        return filterDoc._id.toString()
      }
      logger.warn(`[AI Service] Filter ObjectId NOT FOUND for name "${filterName}" in collection "${collectionName}".`)
      return null
    } catch (error) {
      logger.error({ error }, `[AI Service] Error finding filter ID for "${filterName}"`)
      return null
    }
  }

  private async _fetchProductByNameNative(productName: string): Promise<MongoProduct | null> {
    const product = await databaseService.products.findOne({
      $or: [{ name_on_list: productName }, { productName_detail: productName }]
    })
    return product as MongoProduct | null
  }

  private async _fetchAndPopulateProductsNative(conditions: any): Promise<MongoProduct[]> {
    const pipeline = [
      { $match: conditions },
      { $limit: 200 },
      { $lookup: { from: 'filter_brand', localField: 'filter_brand', foreignField: '_id', as: 'populated_brand' } },
      {
        $lookup: {
          from: 'filter_dac_tinh',
          localField: 'filter_dac_tinh',
          foreignField: '_id',
          as: 'populated_dac_tinh'
        }
      },
      {
        $lookup: {
          from: 'filter_hsk_ingredient',
          localField: 'filter_hsk_ingredient',
          foreignField: '_id',
          as: 'populated_ingredient'
        }
      },
      {
        $lookup: {
          from: 'filter_hsk_product_type',
          localField: 'filter_hsk_product_type',
          foreignField: '_id',
          as: 'populated_product_type'
        }
      },
      {
        $lookup: { from: 'filter_hsk_size', localField: 'filter_hsk_size', foreignField: '_id', as: 'populated_size' }
      },
      {
        $lookup: {
          from: 'filter_hsk_skin_type',
          localField: 'filter_hsk_skin_type',
          foreignField: '_id',
          as: 'populated_skin_type'
        }
      },
      {
        $lookup: { from: 'filter_hsk_uses', localField: 'filter_hsk_uses', foreignField: '_id', as: 'populated_uses' }
      },
      { $unwind: { path: '$populated_brand', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$populated_dac_tinh', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$populated_ingredient', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$populated_product_type', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$populated_size', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$populated_skin_type', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$populated_uses', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name_on_list: 1,
          engName_on_list: 1,
          price_on_list: 1,
          image_on_list: 1,
          hover_image_on_list: 1,
          product_detail_url: 1,
          productName_detail: 1,
          engName_detail: 1,
          description_detail: 1,
          ingredients_detail: 1,
          guide_detail: 1,
          specification_detail: 1,
          main_images_detail: 1,
          sub_images_detail: 1,
          filter_origin: 1,
          Quantity: 1,
          details_scraped_at: 1,
          filter_brand: '$populated_brand',
          filter_dac_tinh: '$populated_dac_tinh',
          filter_hsk_ingredient: '$populated_ingredient',
          filter_hsk_product_type: '$populated_product_type',
          filter_hsk_size: '$populated_size',
          filter_hsk_skin_type: '$populated_skin_type',
          filter_hsk_uses: '$populated_uses'
        }
      }
    ]
    return (await databaseService.products.aggregate(pipeline).toArray()) as MongoProduct[]
  }

  public async generateRoutine(request: SkincareAdvisorRequestBody) {
    logger.info('--- Starting Skincare Advisor Service ---')
    const {
      userBudgetUSD = DEFAULT_BUDGET_USD,
      userSchedulePreference = DEFAULT_SCHEDULE,
      language: userLanguage = 'vi'
    } = request
    const userBudgetVND = userBudgetUSD * APPROX_USD_TO_VND_RATE

    if (!request.base64Image || !request.base64Image.startsWith('data:image')) {
      throw new ErrorWithStatus({ message: 'Invalid or missing base64 image data.', status: 400 })
    }

    const diagnosisPrompt = createDiagnosisPrompt(
      request.base64Image,
      userBudgetVND,
      userSchedulePreference,
      KNOWN_SKIN_CONCERNS,
      userLanguage
    )
    const diagnosisResult = await getAICompletion(diagnosisPrompt, MODEL_NAME, true)

    if (diagnosisResult.isSuitableImage === false) {
      throw new ErrorWithStatus({ message: diagnosisResult.rejectionReason, status: 400 })
    }
    const primaryConcern = request.userPreferredSkinType || diagnosisResult.diagnosedSkinConcerns?.[0] || ''
    const { diagnosedSkinConcerns: diagnosedSkinConcernsList = [], generalObservations = [] } = diagnosisResult

    const filterSuggestionPrompt = createFilterSuggestionPrompt(diagnosedSkinConcernsList, generalObservations)
    const aiFilterCriteria: AiSuggestedFilterCriteria = await getAICompletion(filterSuggestionPrompt, MODEL_NAME, true)

    const toObjectIds = (ids: (string | null)[]) => ids.filter(Boolean).map((id) => new ObjectId(id!))
    const [skinConcernTypeId, brandIds, ingredientIds] = await Promise.all([
      this._findFilterObjectIdByName(primaryConcern, 'filter_hsk_skin_type'),
      Promise.all((request.preferredBrands || []).map((name) => this._findFilterObjectIdByName(name, 'filter_brand'))),
      Promise.all(
        (request.preferredIngredients || []).map((name) =>
          this._findFilterObjectIdByName(name, 'filter_hsk_ingredient')
        )
      )
    ])
    const conditions: any = {}
    if (skinConcernTypeId) conditions.filter_hsk_skin_type = new ObjectId(skinConcernTypeId)
    if (brandIds.length > 0) conditions.filter_brand = { $in: toObjectIds(brandIds) }
    if (ingredientIds.length > 0) conditions.filter_hsk_ingredient = { $in: toObjectIds(ingredientIds) }
    if (request.preferredOrigins?.length) conditions.filter_origin = { $in: request.preferredOrigins }

    const fetchedMongoProducts = await this._fetchAndPopulateProductsNative(conditions)

    let priceFilteredProducts = fetchedMongoProducts.filter(
      (p) => parseInt(p.price_on_list.replace(/\D/g, '')) <= userBudgetVND
    )
    if (priceFilteredProducts.length === 0)
      return { info: 'No products found matching the initial criteria and budget.', status: 200 }

    const productsFromDB = priceFilteredProducts.map((p) => transformMongoToAISchema(p, primaryConcern))

    let candidateProducts = applyClientSideFilters(
      productsFromDB,
      { preferredIngredients: request.preferredIngredients },
      aiFilterCriteria
    )
    if (candidateProducts.length === 0)
      return { info: 'No products remained after applying complementary filters.', status: 200 }
    candidateProducts = candidateProducts.slice(0, 50)

    const productSummaries = candidateProducts.map((p) => ({
      name: p.name,
      price: p.price,
      description: p.Detail.desciption
    }))
    const routineSelectionPrompt = createRoutineSelectionPrompt(
      productSummaries,
      diagnosedSkinConcernsList,
      userBudgetVND,
      userSchedulePreference,
      { aiSuggestions: aiFilterCriteria }
    )
    const aiSelectResult = await getAICompletion(routineSelectionPrompt, MODEL_NAME, true)
    const { selectedProductNames = [] } = aiSelectResult
    if (selectedProductNames.length === 0)
      return { info: 'AI could not select a suitable routine from the filtered products.', status: 200 }

    const populatedProducts = await this._fetchAndPopulateProductsNative({
      name_on_list: { $in: selectedProductNames }
    })
    const routineProductDetails = populatedProducts.map((p) => transformMongoToAISchema(p, primaryConcern))
    if (routineProductDetails.length === 0)
      return { info: 'Could not fetch details for any selected products.', status: 200 }

    const finalRecommendationPrompt = createFullRoutineRecommendationJsonPrompt(
      routineProductDetails,
      diagnosedSkinConcernsList,
      generalObservations,
      userBudgetVND,
      userSchedulePreference,
      userLanguage
    )
    const finalJsonResponse = await getAICompletion(finalRecommendationPrompt, MODEL_NAME, true)
    if (
      finalJsonResponse.routineRecommendation &&
      finalJsonResponse.routineRecommendation.productsInRoutine.length > 0
    ) {
      const productDetailsForSchedule = await Promise.all(
        finalJsonResponse.routineRecommendation.productsInRoutine.map(async (p: any) => {
          const productId = p.productUrl.split('/').pop()
          const productFromDb = await databaseService.products.findOne({ _id: new ObjectId(productId) })
          const guideDetail = productFromDb?.guide_detail as DetailTextHtml | undefined

          return {
            id: productId,
            name: p.productName,
            howToUse: guideDetail?.plainText || 'Use as directed.'
          }
        })
      )

      const scheduleGenerationPrompt = createWeeklyScheduleGenerationPrompt(
        productDetailsForSchedule,
        userSchedulePreference as 'AM' | 'PM' | 'AM/PM',
        userLanguage
      )

      const scheduleResult = await getAICompletion(scheduleGenerationPrompt, MODEL_NAME, true)

      if (scheduleResult.schedule) {
        const startDate = getLocalTime()
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 90) 

        finalJsonResponse.routineDetailsForSaving = {
          startDate: startDate.toISOString().split('T')[0], 
          endDate: endDate.toISOString().split('T')[0], 
          schedule: scheduleResult.schedule
        }
      }
    }
    logger.info('Workflow completed successfully.')
    return finalJsonResponse
  }
}

const skincareAdvisorService = new SkincareAdvisorService()
export default skincareAdvisorService
