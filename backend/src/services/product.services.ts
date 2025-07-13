import { ObjectId } from 'mongodb'
import redisClient from './redis.services'
import databaseService from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { ADMIN_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { ProductInCache } from '~/models/requests/Cart.requests'
import { CreateNewProductReqBody, updateProductReqBody } from '~/models/requests/Product.requests'
import Product, { ProductType } from '~/models/schemas/Product.schema'
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
      quantity: product.quantity,
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

    const productData: ProductType = {
      ...payload,
      _id: productID,
      state: payload.state || ProductState.ACTIVE,
      created_at: localTime,
      updated_at: localTime
    }

    if (payload.filter_brand) productData.filter_brand = new ObjectId(payload.filter_brand)
    if (payload.filter_dac_tinh) productData.filter_dac_tinh = new ObjectId(payload.filter_dac_tinh)
    if (payload.filter_hsk_ingredients)
      productData.filter_hsk_ingredients = new ObjectId(payload.filter_hsk_ingredients)
    if (payload.filter_hsk_product_type)
      productData.filter_hsk_product_type = new ObjectId(payload.filter_hsk_product_type)
    if (payload.filter_hsk_size) productData.filter_hsk_size = new ObjectId(payload.filter_hsk_size)
    if (payload.filter_hsk_skin_type) productData.filter_hsk_skin_type = new ObjectId(payload.filter_hsk_skin_type)
    if (payload.filter_hsk_uses) productData.filter_hsk_uses = new ObjectId(payload.filter_hsk_uses)
    if (payload.filter_origin) productData.filter_origin = new ObjectId(payload.filter_origin)

    const result = await databaseService.products.insertOne(new Product(productData))
    console.log(payload)
    console.log(result)
    return result
  }

  async getProductDetail(_id: string) {
    const product = await databaseService.products.findOne({
      _id: new ObjectId(_id)
    })
    if (product == null) {
      throw new ErrorWithStatus({
        message: ADMIN_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return product
  }

  async updateProduct(_id: string, payload: updateProductReqBody) {
    try {
      const updatedPayload = { ...payload }

      const filterFields = [
        'filter_brand',
        'filter_dac_tinh',
        'filter_hsk_ingredients',
        'filter_hsk_product_type',
        'filter_hsk_size',
        'filter_hsk_skin_type',
        'filter_hsk_uses',
        'filter_origin'
      ] as const

      for (const key of filterFields) {
        const value = payload[key]
        if (value) {
          updatedPayload[key] = new ObjectId(value)
        }
      }

      const currentDate = new Date()
      const vietnamTimezoneOffset = 7 * 60
      const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)
      const result = await databaseService.products.findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            ...updatedPayload,
            updated_at: localTime
          }
        },
        {
          returnDocument: 'after'
        }
      )
      return result
    } catch (error) {
      throw new ErrorWithStatus({
        message: ADMIN_MESSAGES.UPDATE_PRODUCT_FAILED,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
  async getProductsFromWishList(productID: string[]) {
    const projection = {
      name_on_list: 1,
      engName_on_list: 1,
      price_on_list: 1,
      image_on_list: 1,
      hover_image_on_list: 1,
      product_detail_url: 1,
      productName_detail: 1,
      engName_detail: 1,
      filter_brand: 1,
      _id: 1,
      quantity: 1,
    }
    const objectIds = productID.map(id => new ObjectId(id))
    const products = await databaseService.products
      .find({ _id: { $in: objectIds } }, { projection })
      .toArray()
    return products
  }
  async updateProductState(productId: string, newState: ProductState, adminId: string) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)
    const result = await databaseService.products.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      {
        $set: {
          state: newState, //Cập nhật trạng thái mới
          updated_at: localTime
        }
      },
      {
        returnDocument: 'after',
        projection: {
          name_on_list: 1,
          state: 1,
          updated_at: 1
        }
      }
    )
    return result
  }

  async getProductStats() {
    const [totalProducts, onSale, lowStock, outOfStock] = await Promise.all([
      // 1. Đếm tổng số sản phẩm
      databaseService.products.countDocuments({}),
      // 2. Đếm sản phẩm đang bán (state = ACTIVE)
      databaseService.products.countDocuments({ state: ProductState.ACTIVE }),
      // 3. Đếm sản phẩm sắp hết hàng (số lượng > 0 và <= 10)
      databaseService.products.countDocuments({ quantity: { $gt: 0, $lte: 10 } }),
      // 4. Đếm sản phẩm đã hết hàng (số lượng = 0)
      databaseService.products.countDocuments({ quantity: 0 })
    ]);

    return {
      totalProducts,
      onSale,
      lowStock,
      outOfStock
    };
  }
}

const productService = new ProductsService()
export default productService
