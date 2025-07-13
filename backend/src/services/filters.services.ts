import { FilterOptionType } from '~/models/types/Ai.types'
import databaseService from '~/services/database.services'
import logger from '~/utils/logger'

const FILTER_PARAMS_MAP: { [key: string]: string } = {
  filter_brand: 'filter_brand',
  filter_hsk_skin_type: 'filter_hsk_skin_type',
  filter_hsk_uses: 'filter_hsk_uses',
  filter_hsk_product_type: 'filter_hsk_product_type',
  filter_dac_tinh: 'filter_dac_tinh',
  filter_hsk_ingredient: 'filter_hsk_ingredient',
  filter_hsk_size: 'filter_hsk_size',
  filter_origin: 'filter_origin'
}

class FilterService {
  private async _loadOptionsForCategory(collectionName: string): Promise<FilterOptionType[]> {
    try {
      const collection = databaseService.collection(collectionName)

      const rawOptions = await collection
        .find(
          {},
          {
            projection: {
              _id: 1,
              option_name: 1
            }
          }
        )
        .toArray()

      const options = rawOptions
        .map((opt) => ({
          filter_ID: opt._id.toString(),
          name: opt.option_name
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

      logger.info(`Loaded ${options.length} options for "${collectionName}" from collection.`)
      return options
    } catch (error) {
      logger.error({ error, collectionName }, `Error loading options for "${collectionName}":`)
      return []
    }
  }

  public async getAllFilterOptions(): Promise<Record<string, FilterOptionType[]>> {
    const allOptions: Record<string, FilterOptionType[]> = {}
    const promises = []

    for (const keyInResponse in FILTER_PARAMS_MAP) {
      const categoryParamToFetch = FILTER_PARAMS_MAP[keyInResponse]
      promises.push(
        this._loadOptionsForCategory(categoryParamToFetch).then((options) => {
          allOptions[keyInResponse] = options
        })
      )
    }

    await Promise.all(promises)
    logger.info('All filterable options loaded for frontend with structured keys.')
    return allOptions
  }
}

const filterService = new FilterService()
export default filterService
