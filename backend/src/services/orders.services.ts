import cartService from './cart.services'
import redisClient from './redis.services'
import databaseService from './database.services'
import {
  CancelRequestStatus,
  DiscountType,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  ProductState,
  RefundStatus
} from '~/constants/enums'
import { ClientSession, ObjectId } from 'mongodb'
import {
  BuyNowReqBody,
  OrderReqBody,
  PendingOrder,
  PrepareOrderPayload,
  ProductInOrder,
  RevenueFilterOptions,
  TempOrder
} from '~/models/requests/Orders.requests'
import { ProductInCart } from '~/models/requests/Cart.requests'
import { ErrorWithStatus } from '~/models/Errors'
import { CART_MESSAGES, ORDER_MESSAGES, PRODUCTS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import OrderDetail from '~/models/schemas/Orders/OrderDetail.schema'
import Order, { CancelRequest } from '~/models/schemas/Orders/Order.schema'
import { VoucherType } from '~/models/schemas/Voucher.schema'
import Product from '~/models/schemas/Product.schema'
import { getLocalTime } from '~/utils/date'

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
        if (!product) {
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', p.ProductID),
            status: 404
          })
        }

        if (product.state !== ProductState.ACTIVE) {
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.NOT_ACTIVE,
            status: HTTP_STATUS.BAD_REQUEST
          })
        }

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
          Name: product.name_on_list,
          Image: product.image_on_list,
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
      throw new ErrorWithStatus({ message: CART_MESSAGES.NOT_SELECTED, status: HTTP_STATUS.BAD_REQUEST })
    }

    const tempOrder = await this.buildTempOrder(userId, selectedProducts)
    const tempOrderKey = this.getTempOrderKey(userId)
    await this.saveOrderToRedis(tempOrderKey, tempOrder)

    return tempOrder
  }

  async buyNow(userId: string, quantity: number, product: Product): Promise<TempOrder> {
    const selectedProducts: ProductInCart[] = [
      {
        ProductID: product._id?.toString()!,
        Quantity: quantity
      }
    ]

    const tempOrder = await this.buildTempOrder(userId, selectedProducts)
    const tempOrderKey = this.getTempOrderKey(userId)
    await this.saveOrderToRedis(tempOrderKey, tempOrder)

    return tempOrder
  }

  async checkOut(payload: OrderReqBody, userId: string, voucher: VoucherType | undefined) {
    const localTime = getLocalTime()

    const tempOrderKey = this.getTempOrderKey(userId)
    const tempOrder: TempOrder = await this.getTempOrder(tempOrderKey)

    if (!tempOrder || tempOrder.Products.length <= 0) {
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.EMPTY_OR_EXPIRED,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    await Promise.all(
      tempOrder.Products.map(async (p) => {
        const product = await databaseService.products.findOne({
          _id: new ObjectId(p.ProductID)
        })

        if (!product) {
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', p.ProductID),
            status: 404
          })
        }

        if ((product.quantity || 0) < p.Quantity) {
          throw new ErrorWithStatus({
            message: PRODUCTS_MESSAGES.NOT_ENOUGHT.replace('%s', `${product.quantity} items with id ${p.ProductID}`),
            status: HTTP_STATUS.BAD_REQUEST
          })
        }
      })
    )

    const status = OrderStatus.PENDING
    const paymentStatus = payload.PaymentStatus ?? PaymentStatus.UNPAID

    console.log(payload)
    const order: Partial<Order> = {
      UserID: new ObjectId(userId),
      RecipientName: payload.RecipientName || "",
      PhoneNumber: payload.PhoneNumber || "",
      ShipAddress: payload.ShipAddress,
      Description: payload.Description || '',
      RequireDate: payload.RequireDate,
      PaymentMethod: payload.PaymentMethod,
      PaymentStatus: paymentStatus,
      Status: status
    }

    let discount = 0
    const priceBeforeDiscount = tempOrder.TotalPrice
    if (voucher) {
      const maxDiscountAmount = isNaN(Number(voucher.maxDiscountAmount)) ? 0 : Number(voucher.maxDiscountAmount)
      let percentDiscountValue = (voucher.discountValue / 100) * tempOrder.TotalPrice
      percentDiscountValue =
        voucher.maxDiscountAmount && percentDiscountValue > maxDiscountAmount ? percentDiscountValue : maxDiscountAmount
      discount = voucher.discountType === DiscountType.Percentage ? percentDiscountValue : voucher.discountValue

      order.DiscountValue = discount.toString()
      order.VoucherSnapshot = {
        code: voucher.code,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscountAmount: voucher.maxDiscountAmount
      }
    }

    const totalPrice = tempOrder.TotalPrice - discount
    order.TotalPrice = Math.max(0, totalPrice).toString()

    const session = databaseService.getClient().startSession()

    let orderDetails: any[] = []
    try {
      let orderId = null as ObjectId | null
      await session.withTransaction(async () => {
        const insertedOrder = await databaseService.orders.insertOne(
          {
            ...order,
            created_at: localTime,
            updated_at: localTime
          },
          { session }
        )
        orderId = insertedOrder.insertedId

        orderDetails = tempOrder.Products.map((p: ProductInOrder) => {
          return {
            ProductID: new ObjectId(p.ProductID),
            OrderID: orderId,
            Quantity: p.Quantity.toString(),
            OrderDate: tempOrder.CreatedAt || new Date(),
            UnitPrice: p.PricePerUnit.toString()
          }
        })

        await databaseService.orderDetails.insertMany(orderDetails, { session })

        const bulkOps = tempOrder.Products.map((p) => ({
          updateOne: {
            filter: { _id: new ObjectId(p.ProductID) },
            update: { $inc: { quantity: -p.Quantity } }
          }
        }))

        await databaseService.products.bulkWrite(bulkOps, { session })

        if (voucher?._id) {
          await databaseService.vouchers.updateOne(
            { _id: new ObjectId(voucher._id) },
            { $inc: { usedCount: 1 } },
            { session }
          )
        }
      })

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

      await redisClient.del(tempOrderKey)

      return {
        orderId,
        ...order,
        ...(discount > 0 && { PriceBeforeDiscount: priceBeforeDiscount.toString() }),
        orderDetails: orderDetails.map(({ OrderID, ...rest }) => rest)
      }
    } finally {
      await session.endSession()
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

      const { ProductID, OrderID, ...restDetail } = detail

      if (!detailMap.has(orderId)) detailMap.set(orderId, [])

      detailMap.get(orderId)?.push(restDetail)
    })

    return orders.map((order) => ({
      orderId: order._id,
      orderDetail: detailMap.get(order._id.toString()) || [],
      orderStatus: order.Status
    }))
  }

  async getOrderById(order: Order) {
    const orderDetails = await this.getOrderDetailByOrderId(order._id!.toString())
    const enrichedDetails = await this.enrichOrderDetailsWithProducts(orderDetails)
    const user = await databaseService.users.findOne(
      { _id: order.UserID },
      {
        projection: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          email: 1,
          location: 1,
          username: 1,
          phone_number: 1,
          avatar: 1
        }
      }
    )
    const { _id, UserID, ...restOrder } = order

    return {
      order: {
        _id,
        User: user,
        ...restOrder
      },
      orderDetail: enrichedDetails.map(({ ProductID, OrderID, ...rest }) => ({
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

  async cancelOrder(payload: { staffNote?: string; reason: string }, userId: string, order: Order) {
    const session = databaseService.getClient().startSession()
    try {
      let updatedOrder: Order | null = null
      await session.withTransaction(async () => {
        const now = getLocalTime()
        const updateSet = {
          Status: OrderStatus.CANCELLED,
          updated_at: now,
          'CancelRequest.status': CancelRequestStatus.APPROVED,
          'CancelRequest.reason': payload.reason,
          'CancelRequest.requestedAt': now,
          'CancelRequest.approvedAt': now,
          'CancelRequest.staffId': new ObjectId(userId),
          'CancelRequest.staffNote': payload.staffNote ?? ''
        }

        updatedOrder = await this.handleOrderCancellation({ order, updateSet, session })
      })
      return updatedOrder
    } catch (error) {
      console.error('Transaction failed:', error)
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.CANCEL_FAIL,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    } finally {
      await session.endSession()
    }
  }

  async approveCancelRequest(
    payload: { staffNote?: string },
    userId: string,
    order: Order,
    options: { status: CancelRequestStatus }
  ) {
    const session = databaseService.getClient().startSession()
    try {
      let updatedOrder: Order | null = null
      await session.withTransaction(async () => {
        const now = getLocalTime()
        const updateSet = {
          Status: OrderStatus.CANCELLED,
          'CancelRequest.status': options.status,
          'CancelRequest.approvedAt': now,
          'CancelRequest.staffId': new ObjectId(userId),
          'CancelRequest.staffNote': payload?.staffNote ?? '',
          updated_at: now
        }

        updatedOrder = await this.handleOrderCancellation({ order, updateSet, session })
      })
      return updatedOrder
    } catch (error) {
      console.error('Transaction failed:', error)
      throw new ErrorWithStatus({
        message: ORDER_MESSAGES.CANCEL_FAIL,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    } finally {
      await session.endSession()
    }
  }

  async rejectCancelRequest(
    payload: { staffNote?: string },
    userId: string,
    order: Order,
    options: { status: CancelRequestStatus }
  ) {
    const now = getLocalTime()
    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      { _id: order._id },
      {
        $set: {
          'CancelRequest.status': options.status,
          'CancelRequest.rejectedAt': now,
          'CancelRequest.staffId': new ObjectId(userId),
          'CancelRequest.staffNote': payload?.staffNote ?? '',
          updated_at: now
        }
      },
      { returnDocument: 'after' }
    )

    return updatedOrder
  }

  private async handleOrderCancellation({
    order,
    updateSet,
    session
  }: {
    order: Order
    updateSet: Record<string, any>
    session: ClientSession
  }) {
    if (order.PaymentStatus === PaymentStatus.PAID) {
      updateSet.RefundStatus = RefundStatus.REQUESTED
    }

    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      { _id: order._id },
      { $set: updateSet },
      { returnDocument: 'after', session }
    )

    await this.returnStock(order._id!, session, order.VoucherSnapshot?.code)

    return updatedOrder
  }

  async returnStock(orderId: ObjectId, session: ClientSession, voucherCode?: string) {
    const orderDetail = await databaseService.orderDetails.find({ OrderID: orderId }).toArray()
    if (!orderDetail.length) return

    const bulkStockOps = orderDetail.map((detail) => ({
      updateOne: {
        filter: { _id: new ObjectId(detail.ProductID) },
        update: { $inc: { quantity: parseInt(detail.Quantity || '0') } }
      }
    }))

    if (bulkStockOps.length) {
      await databaseService.products.bulkWrite(bulkStockOps, { session })
    }

    if (voucherCode) {
      await databaseService.vouchers.updateOne({ code: voucherCode }, { $inc: { usedCount: -1 } }, { session })
    }
  }

  async requestCancelOrder(payload: { reason: string }, order: Order) {
    const now = getLocalTime()
    const cancelRequest: CancelRequest = {
      status: CancelRequestStatus.REQUESTED,
      reason: payload.reason,
      requestedAt: now,
      staffId: null as any
    }

    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      { _id: order._id },
      {
        $set: {
          CancelRequest: cancelRequest,
          updated_at: now
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return updatedOrder
  }

  async getOrderRevenue(options: RevenueFilterOptions) {
    const {
      specificDate,
      fromDate,
      toDate,
      filterBrand,
      filterDacTinh,
      filterHskIngredients,
      filterHskProductType,
      filterHskSize,
      filterHskSkinType,
      filterHskUses,
      filterOrigin
    } = options

    const match: any = {
      PaymentStatus: PaymentStatus.PAID
    }

    if (specificDate) {
      const date = new Date(specificDate)
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)

      match.created_at = {
        $gte: date,
        $lt: nextDate
      }
    } else if (fromDate && toDate) {
      const startDate = new Date(fromDate)
      const endDate = new Date(toDate)
      endDate.setDate(endDate.getDate() + 1)
      match.created_at = {
        $gte: startDate,
        $lt: endDate
      }
    }

    const filters: any = {}

    filterBrand && (filters.filter_brand = filterBrand)
    filterDacTinh && (filters.filter_dac_tinh = filterDacTinh)
    filterHskIngredients && (filters.filter_hsk_ingredients = filterHskIngredients)
    filterHskProductType && (filters.filter_hsk_product_type = filterHskProductType)
    filterHskSize && (filters.filter_hsk_size = filterHskSize)
    filterHskSkinType && (filters.filter_hsk_skin_type = filterHskSkinType)
    filterHskUses && (filters.filter_hsk_uses = filterHskUses)
    filterOrigin && (filters.filter_origin = filterOrigin)

    const totalOrder = await databaseService.orders.find(match).toArray()
    const orderIds = totalOrder.map((o) => o._id)
    const orderDetails = await databaseService.orderDetails.find({ OrderID: { $in: orderIds } }).toArray()

    const productIds = orderDetails.map((detail) => new ObjectId(detail.ProductID))

    const products = await databaseService.products.find({ _id: { $in: productIds }, ...filters }).toArray()

    const matchedProductIds = new Set(products.map((p) => p._id.toString()))

    const matchedOrderDetails = orderDetails.filter(
      (detail) => detail.ProductID && matchedProductIds.has(detail.ProductID.toString())
    )

    const matchedOrderIds = [...new Set(matchedOrderDetails.map((detail) => detail.OrderID?.toString()))]
    const filteredOrder = totalOrder.filter((order) => matchedOrderIds.includes(order._id.toString()))

    const ordersByDate: { [key: string]: any[] } = {}

    filteredOrder.forEach((order) => {
      const date = order.created_at?.toISOString().split('T')[0]!
      if (!ordersByDate[date]) {
        ordersByDate[date] = []
      }
      ordersByDate[date].push(order)
    })

    const dailyResult = Object.keys(ordersByDate).map((date) => {
      const orders = ordersByDate[date]
      const totalRevenue = orders.reduce((total, order) => total + Number(order.TotalPrice), 0)

      return {
        date,
        totalOrder: orders.length,
        totalRevenue
      }
    })

    return dailyResult
  }

  async countOrder() {
    const orders = await databaseService.orders
      .aggregate([
        {
          $group: {
            _id: '$Status',
            count: { $sum: 1 }
          }
        }
      ])
      .toArray()

    const countsByStatus = orders.reduce((acc, cur) => {
      acc[cur._id] = cur.count
      return acc
    }, {})

    const total = orders.reduce((sum, cur) => sum + cur.count, 0)

    return {
      total,
      statusCounts: countsByStatus
    }
  }

  async getOrderDetailByOrderId(id: string): Promise<Array<OrderDetail>> {
    const orderDetails = await databaseService.orderDetails.find({ OrderID: new ObjectId(id) }).toArray()
    return orderDetails
  }

  private async saveOrderToRedis(orderKey: string, orderData: TempOrder) {
    await redisClient.set(orderKey, JSON.stringify(orderData), { EX: 30 * 60 })
  }

  getPendingOrderKey(orderId: string) {
    return `${process.env.PENDING_ORDER_KEY}${orderId}`
  }

  async getPendingOrder(key: string) {
    const existingOrder = await redisClient.get(key)
    if (existingOrder) {
      return JSON.parse(existingOrder)
    }
  }

  async saveOrderToDB(orderId: ObjectId) {
    const pendingOrderKey = ordersService.getPendingOrderKey(orderId?.toString())
    const pendingOrder: PendingOrder = await ordersService.getPendingOrder(pendingOrderKey)

    const { Details, ...order } = pendingOrder
    const savedOrder = {
      _id: orderId,
      ...order,
      UserID: new ObjectId(order.UserID),
      PaymentStatus: order.PaymentMethod !== PaymentMethod.COD ? PaymentStatus.PAID : PaymentStatus.UNPAID,
      Status: OrderStatus.PENDING,
      created_at: getLocalTime(),
      updated_at: getLocalTime()
    }

    const orderDetail = Details.map((d) => ({
      ...d,
      ProductID: new ObjectId(d.ProductID),
      OrderID: orderId
    }))

    const session = databaseService.getClient().startSession()
    try {
      await session.withTransaction(async () => {
        await databaseService.orders.insertOne(savedOrder, { session })
        await databaseService.orderDetails.insertMany(orderDetail, { session })
        const bulkOps = Details.map((d) => ({
          updateOne: {
            filter: { _id: new ObjectId(d.ProductID) },
            update: { $inc: { quantity: -parseInt(d.Quantity ?? '0') } }
          }
        }))

        await databaseService.products.bulkWrite(bulkOps, { session })

        if (order.VoucherSnapshot) {
          await databaseService.vouchers.updateOne(
            { code: order.VoucherSnapshot.code },
            { $inc: { usedCount: 1 } },
            { session }
          )
        }
      })
      const cartKey = cartService.getCartKey(order.UserID.toString())
      await redisClient.del(cartKey)
      await redisClient.del(pendingOrderKey)
      return {
        order: savedOrder,
        orderDetail: Details
      }
    } catch (error) {
      console.error('Transaction failed:', error)
      throw new ErrorWithStatus({
        message: 'Failed to save order to database',
        status: 500
      })
    } finally {
      await session.endSession()
    }
  }
}

const ordersService = new OrdersService()
export default ordersService
