import databaseService from './database.services'
import redisClient from './redis.services'
import { ObjectId } from 'mongodb'
import { AddToCartPayload, Cart, ProductInCart, UpdateCartPayload } from '~/models/requests/Cart.requests'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { CART_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import Product from '~/models/schemas/Product.schema'
import productService from './product.services'

class CartService {
  async addToCart(payload: AddToCartPayload, userId: string, product: Product) {
    const { ProductID, Quantity } = payload

    const cartKey = this.getCartKey(userId)
    const cart = (await this.getCart(cartKey)) || { Products: [] }
    const productIndex = this.findProductIndex(cart, ProductID)
    const existingQty = productIndex > -1 ? cart.Products[productIndex].Quantity : 0
    const totalRequested = existingQty + Quantity

    if (totalRequested > (product.quantity || 0)) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.NOT_ENOUGHT.replace(
          '%s',
          `${product.quantity} item${Number(product.quantity) > 1 ? 's' : ''}`
        ),
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (productIndex > -1) {
      cart.Products[productIndex].Quantity = totalRequested
    } else {
      cart.Products.push({ ProductID, Quantity })
    }

    const multi = redisClient.multi()
    multi.set(cartKey, JSON.stringify(cart))
    multi.expire(cartKey, 60 * 60 * 24)
    await multi.exec()
    return cart
  }

  async fetchCart(userId: string) {
    const cartKey = this.getCartKey(userId)
    const cart = await this.getCart(cartKey)
    return this.formatCart(cart)
  }

  async updateProductQuantityInCart(payload: UpdateCartPayload, product: Product, userId: string) {
    const { Quantity } = payload

    const cartKey = this.getCartKey(userId)
    const cart = await this.getCart(cartKey)
    if (!cart) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const productIndex = this.findProductIndex(cart, product._id?.toString()!)
    if (productIndex < 0) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    //Quantity update logic
    if (Quantity === 0) {
      cart.Products.splice(productIndex, 1) //Remove product
    } else {
      if (Quantity > (product.quantity || 0)) {
        throw new ErrorWithStatus({
          message: PRODUCTS_MESSAGES.NOT_ENOUGHT.replace(
            '%s',
            `${product.quantity} item${Number(product.quantity) > 1 ? 's' : ''}`
          ),
          status: HTTP_STATUS.BAD_REQUEST
        })
      }

      cart.Products[productIndex].Quantity = Quantity
    }

    await this.saveCart(cartKey, cart)
    return this.formatCart(cart)
  }

  async removeProductFromCart(productId: string, userId: string) {
    const cartKey = this.getCartKey(userId)
    let cart = await this.getCart(cartKey)
    if (!cart) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const productIndex = cart.Products.findIndex((p: ProductInCart) => p.ProductID.toString() === productId.toString())
    if (productIndex < 0) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    cart.Products.splice(productIndex, 1)

    await this.saveCart(cartKey, cart)
    //Config response sau
    return this.formatCart(cart)
  }

  async getCart(cartKey: string) {
    const existingCart = await redisClient.get(cartKey)
    if (existingCart) {
      return JSON.parse(existingCart)
    }
  }

  async saveCart(cartKey: string, cartData: Cart) {
    await redisClient.set(cartKey, JSON.stringify(cartData), { EX: 30 * 24 * 60 * 60 })
  }

  getCartKey(userId: ObjectId | string) {
    return `${process.env.CART_KEY}${userId}`
  }

  private findProductIndex(cart: any, productId: string) {
    return cart.Products.findIndex((p: ProductInCart) => p.ProductID === productId)
  }

  private async formatCart(cart: Cart | null): Promise<{ Products: any[] }> {
    if (!cart || !cart.Products || cart.Products.length === 0) {
      return { Products: [] }
    }

    const productKeys = cart.Products.map((p: ProductInCart) => productService.getProductInfoKey(p.ProductID))

    let productInfos = await Promise.all(productKeys.map((key: string) => redisClient.hGetAll(key)))

    const missingIndexes = productInfos
      .map((info, i) => (Object.keys(info).length === 0 ? i : -1))
      .filter((i) => i !== -1)

    if (missingIndexes.length > 0) {
      for (const index of missingIndexes) {
        const productId = cart.Products[index].ProductID
        const product = await databaseService.products.findOne({ _id: new ObjectId(productId) })

        if (!product) {
          cart.Products.splice(index, 1)
          continue
        }

        const productKey = productService.getProductInfoKey(productId)
        await redisClient.hSet(productKey, 'name', product.name_on_list ?? '')
        await redisClient.hSet(productKey, 'quantity', product.quantity?.toString() ?? '0')
        await redisClient.hSet(productKey, 'image', product.image_on_list ?? '')
        await redisClient.hSet(productKey, 'price', product.price_on_list ?? '0')
        const expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60
        await redisClient.expireAt(productKey, expirationTime)

        productInfos[index] = {
          name: product.name_on_list ?? '',
          quantity: product.quantity?.toString() ?? '0',
          image: product.image_on_list ?? '',
          price: product.price_on_list ?? '0'
        }
      }
    }

    const detailedCart = cart.Products.map((item: ProductInCart, index: number) => {
      const info = productInfos[index]
      const price = parseFloat(info.price || '0')
      const quantity = parseInt(info.quantity || '0')

      return {
        ProductID: item.ProductID,
        Quantity: item.Quantity,
        QuantityInStock: quantity,
        name: info.name,
        image: info.image,
        unitPrice: price,
        totalPrice: price * item.Quantity
      }
    })
    console.log(detailedCart)

    return {
      Products: detailedCart
    }
  }

  async clearCart(userId: string) {
    const cartKey = this.getCartKey(userId)
    const cart = await this.getCart(cartKey)
    if (!cart || (cart.Products && cart.Products.length <= 0)) {
      throw new ErrorWithStatus({
        message: CART_MESSAGES.EMPTY_OR_EXPIRED,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return await redisClient.del(cartKey)
  }
}
const cartService = new CartService()
export default cartService
