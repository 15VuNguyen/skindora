import cartService from './cart.services'
import redisClient from './redis.services'
import databaseService from './database.services'
import { OrderStatus, OrderType } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import {
  BuyNowReqBody,
  OrderReqBody,
  PrepareOrderPayload,
  ProductInOrder,
  TempOrder
} from '~/models/requests/Orders.requests'
import { ProductInCart } from '~/models/requests/Cart.requests'
import { ErrorWithStatus } from '~/models/Errors'
import { CART_MESSAGES, ORDER_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import OrderDetail from '~/models/schemas/Orders/OrderDetail.schema'
import Order from '~/models/schemas/Orders/Order.schema'

class OrdersService {
  private async buildTempOrder(userId: string, selectedProducts: ProductInCart[]): Promise<TempOrder> {
    const productIds = selectedProducts.map((p) => new ObjectId(p.ProductID))
    const products = await databaseService.products.find({ _id: { $in: productIds } }).toArray()
    const productMap = new Map(products.map((p) => [p._id.toString(), p]))
    let finalPrice = 0

    const tempOrder: TempOrder = {
      UserID: userId,
      Products: selectedProducts.map((p) => {
        const product = productMap.get(p.ProductID)
        if (!product) throw new ErrorWithStatus({ message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND, status: 404 })

        if (!product.quantity || product.quantity < p.Quantity) {
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.NOT_ENOUGHT.replace('%s', `${product.quantity} items`),
            status: HTTP_STATUS.BAD_REQUEST
          })
        }

        const unitPrice = parseInt(product.price_on_list ?? '0')
        const totalPrice = unitPrice * p.Quantity
        finalPrice += totalPrice

        return {
          ProductID: p.ProductID,
          Quantity: p.Quantity,
          PricePerUnit: unitPrice,
          TotalPrice: totalPrice
        }
      }),
      TotalPrice: finalPrice,
      CreatedAt: new Date()
    }

    return tempOrder
  }

  async prepareOrder(userId: string, payload: PrepareOrderPayload): Promise<TempOrder> {
    const cartKey = cartService.getCartKey(userId)
    const cart = await cartService.getCart(cartKey)
    if (!cart || !cart.Products || cart.Products.length <= 0) {
      throw new ErrorWithStatus({ message: CART_MESSAGES.EMPTY_OR_EXPIRED, status: HTTP_STATUS.NOT_FOUND })
    }

    const selectedProducts = cart.Products.filter((p: ProductInCart) =>
      payload.selectedProductIDs.includes(p.ProductID)
    )
    if (selectedProducts.length === 0) {
      throw new ErrorWithStatus({ message: CART_MESSAGES.NOT_SELECTED, status: HTTP_STATUS.NOT_FOUND })
    }

    const tempOrder = await this.buildTempOrder(userId, selectedProducts)
    const tempOrderKey = this.getTempOrderKey(userId)
    await this.saveOrderToRedis(tempOrderKey, tempOrder)

    return tempOrder
  }

  async buyNow(userId: string, payload: BuyNowReqBody): Promise<TempOrder> {
    const { productId, quantity } = payload
    const product = await databaseService.products.findOne({ _id: new ObjectId(productId) })
    if (!product) {
      throw new ErrorWithStatus({ message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }

    const selectedProducts: ProductInCart[] = [
      {
        ProductID: productId,
        Quantity: quantity
      }
    ]

    const tempOrder = await this.buildTempOrder(userId, selectedProducts)
    const tempOrderKey = this.getTempOrderKey(userId)
    await this.saveOrderToRedis(tempOrderKey, tempOrder)

    return tempOrder
  }

  async checkOut(payload: OrderReqBody, userId: string) {
    //Kiểm tra thông tin đơn hàng(thêm sau)
    if (!payload.ShipAddress || !payload.RequireDate) {
      throw new Error('ShipAddress and RequireDate are required')
    }

    const tempOrderKey = this.getTempOrderKey(userId)
    const tempOrder: TempOrder = await this.getTempOrder(tempOrderKey)

    if (!tempOrder) {
      throw new Error('No order found or it has expired')
    }

    const status = OrderStatus.PENDING
    //insert order into db
    const order = await databaseService.orders.insertOne({
      UserID: new ObjectId(userId),
      ShipAddress: payload.ShipAddress,
      Description: payload.Description ?? '',
      RequireDate: payload.RequireDate || new Date().toISOString(),
      // ShippedDate?: string
      Status: status
    })
    const orderId = order.insertedId

    //insert order details into db
    const orderDetail = tempOrder.Products.map((p: ProductInOrder) => {
      return {
        ProductID: new ObjectId(p.ProductID),
        OrderID: orderId,
        Quantity: p.Quantity.toString(),
        OrderDate: tempOrder.CreatedAt || new Date(),
        TotalPrice: p.TotalPrice.toString()
      }
    })

    await databaseService.orderDetails.insertMany(orderDetail)

    //Xoá những product đã order trong cart, tempOrder khỏi redis
    if (payload.type === OrderType.CART) {
      const cartKey = cartService.getCartKey(userId)
      const cart = await cartService.getCart(cartKey)
      const remainingProducts = cart.Products.filter((p: ProductInCart) => {
        const orderedProductIds = tempOrder.Products.map((p: ProductInOrder) => p.ProductID)
        return !orderedProductIds.includes(p.ProductID)
      })

      if (remainingProducts.length <= 0) {
        await redisClient.del(cartKey)
      } else {
        await cartService.saveCart(cartKey, { Products: remainingProducts })
      }
    }

    await redisClient.del(tempOrderKey)
    //Trả thông tin đơn hàng đã tạo
    return {
      orderId: orderId.toString(),
      orderDetails: orderDetail,
      status: status
    }
  }

  async getCurrentOrder(userId: string) {
    const orderKey = this.getTempOrderKey(userId)
    const order = await this.getTempOrder(orderKey)
    if (!order || order.Products.length <= 0) {
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.EMPTY_OR_EXPIRED,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return order
  }

  getTempOrderKey(userId: ObjectId | string) {
    return `${process.env.TEMP_ORDER_KEY}${userId}`
  }

  async getTempOrder(tempOrderKey: string) {
    const tempOrder = await redisClient.get(tempOrderKey)
    if (tempOrder) {
      return JSON.parse(tempOrder)
    }
  }

  async getAllOrdersByUserId(userId: string) {
    const orders = await databaseService.orders.find({ UserID: new ObjectId(userId) }).toArray()
    if (orders.length === 0) return []

    const orderIds = orders.map((order) => order._id)
    const orderDetails = await databaseService.orderDetails.find({ OrderID: { $in: orderIds } }).toArray()

    const enrichedDetails = await this.enrichOrderDetailsWithProducts(orderDetails)

    const detailMap = new Map<string, any[]>()
    
    enrichedDetails.forEach((detail) => {
      const orderId = detail.OrderID?.toString() || ''

      const {ProductID, OrderID, ...restDetail} = detail

      if (!detailMap.has(orderId)) detailMap.set(orderId, [])

      detailMap.get(orderId)?.push(restDetail)
    })

    return orders.map((order) => ({
      orderId: order._id,
      orderDetail: detailMap.get(order._id.toString()) || []
    }))
  }

  async getOrderById(order: Order) {
    const orderDetails = await this.getOrderDetailByOrderId(order._id!.toString())
    const enrichedDetails = await this.enrichOrderDetailsWithProducts(orderDetails)

    return {
      ...order,
      orderDetail: enrichedDetails.map(({ProductID, OrderID, ...rest}) => ({
        ...rest
      }))
    }
  }

  private async enrichOrderDetailsWithProducts(orderDetails: OrderDetail[]) {
    const productIds = [...new Set(orderDetails.map((od) => od.ProductID?.toString()))].map((id) => new ObjectId(id))
    const products = await databaseService.products
      .find({ _id: { $in: productIds } })
      .project({ _id: 1, name_on_list: 1, image_on_list: 1, price_on_list: 1 })
      .toArray()

    const productInfoMap = new Map(
      products.map((product) => [
        product._id.toString(),
        {
          productId: product._id,
          name: product.name_on_list,
          image: product.image_on_list,
          price: product.price_on_list
        }
      ])
    )

    return orderDetails.map((detail) => ({
      ...detail,
      Products: productInfoMap.get(detail.ProductID?.toString())
    }))
  }

  async getOrderDetailByOrderId(id: string): Promise<Array<OrderDetail>> {
    const orderDetails = await databaseService.orderDetails.find({ OrderID: new ObjectId(id) }).toArray()
    return orderDetails
  }

  private async saveOrderToRedis(orderKey: string, orderData: TempOrder) {
    await redisClient.set(orderKey, JSON.stringify(orderData), { EX: 30 * 60 })
  }
}

const ordersService = new OrdersService()
export default ordersService
