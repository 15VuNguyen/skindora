import { ObjectId } from 'mongodb'
import redisClient from './redis.services'
import databaseService from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'

class ProductsService {
  async addToWishList(userID: string, productIds: string[]) {
    const key = process.env.WISHLIST_KEY + userID.toString()

    for (const id of productIds) {
      const product = await databaseService.products.findOne({
        _id: new ObjectId(id)
      })

      if (!product) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      await redisClient.sAdd(key, id.toString())
    }
  }

  async removeFromWishList(userID: string, productIds: string[]) {
    const key = process.env.WISHLIST_KEY + userID

    console.log(key)

    for (const id of productIds) {
      const product = await databaseService.products.findOne({ _id: new ObjectId(id) })

      if (!product) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      const isMember = await redisClient.sIsMember(key, id.toString())
      if (!isMember) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.PRODUCT_NOT_IN_WISH_LIST,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      await redisClient.sRem(key, id.toString())
    }
  }

  async getWishList(userID: string) {
    const key = process.env.WISHLIST_KEY + userID.toString()
    const productIds = await redisClient.sMembers(key)
    if (!productIds || productIds.length === 0) {
      return []
    }
    return productIds
  }

  async getAllProducts() {
    try {
      const products = await databaseService.products.find({}).toArray()
      return products
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  // async getPaginatedProducts(query: { page?: string; limit?: string }) {
  //   const paginatedResult = await createPaginatedQuery(ProductModel, query, {})
  //   //có thể thêm các điều kiện lọc ở đây
  //   //ví dụ //state: ProductState.ACTIVE
  //   return paginatedResult
  // }
}

const productService = new ProductsService()
export default productService
