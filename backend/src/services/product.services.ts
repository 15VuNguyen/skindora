import { ObjectId } from 'mongodb'
import redisClient from './redis.services'
import databaseService from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { PRODUCTS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { ProductInCache } from '~/models/requests/Cart.requests'
import { CreateNewProductReqBody } from '~/models/requests/Product.requests'
import Product from '~/models/schemas/Product.schema'
import { ProductState } from '~/constants/enums'

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

  async cacheProductInfo(product: ProductInCache) {
    const key = this.getProductInfoKey(product._id)
    await redisClient.hSet(key, {
      price: product.price.toString(),
      name: product.name,
      image: product.image
    })
    await redisClient.expire(key, 60 * 60 * 24)
  }

  getProductInfoKey(productId: string) {
    return `${process.env.PRODUCT_INFO_KEY}${productId}`
  }
  // lấy key trong redis
  async getAllWishListKeys() {
    const key: string[] = []
    let cursor = '0'

    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: process.env.WISHLIST_KEY + '_*',
        COUNT: 100
      })

      cursor = reply.cursor
      key.push(...reply.keys)
    } while (cursor !== '0')

    return key
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

  async createNewProduct(payload: CreateNewProductReqBody) {
    const productID = new ObjectId()
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    const result = await databaseService.products.insertOne(
      new Product({
        ...payload,
        _id: productID,
        state: payload.state || ProductState.ACTIVE,
        created_at: localTime,
        updated_at: localTime
      })
    )
    console.log(payload)
    console.log(result)
    return result
  }
}

const productService = new ProductsService()
export default productService
