import axios from 'axios'
import CryptoJS from 'crypto-js'
import { v1 as uuidv1 } from 'uuid'
import moment from 'moment'
import redisClient from '../redis.services'
import dotenv from 'dotenv'
import ordersService from '../orders.services'
import { PendingOrder } from '~/models/requests/Orders.requests'

dotenv.config()
interface Item {
  _id: string
  productID: string
  quantity: number
  discount: number
}

interface Order {
  appid: string
  apptransid: string
  appuser: string
  apptime: number
  item: string
  embeddata: string
  amount: number
  description: string
  bankcode: string
  mac?: string
  callback_url?: string
}

const config = {
  app_id: process.env.ZALO_PAY_APP_ID || '',
  key1: process.env.ZALO_PAY_KEY1 || '',
  key2: process.env.ZALO_PAY_KEY2 || '',
  endpoint: process.env.ZALO_PAY_ENDPOINT_SANDBOX || ''
}

const createOrder = async (req: any, res: any): Promise<void> => {
  const orderid = req.redis_order_id

  const pendingOrderKey = ordersService.getPendingOrderKey(orderid?.toString())
  const pendingOrder: PendingOrder = await ordersService.getPendingOrder(pendingOrderKey)

  const { Details } = pendingOrder

  const embeddata = {
    redirecturl: process.env.ZALO_PAY_CALLBACK,
    orderDetails: Details
  }

  const orderDetails = Details

  if (!Array.isArray(orderDetails) || orderDetails.length === 0 || !orderDetails) {
    return res.status(400).json({ error: 'OrderDetails is required and must be a non-empty array.' })
  }

  const order: Order = {
    appid: config.app_id,
    apptransid: `${moment().format('YYMMDD')}_${uuidv1()}`,
    appuser: 'Skin Dora Shop',
    apptime: Date.now(),
    item: JSON.stringify(orderDetails),
    embeddata: JSON.stringify(embeddata),
    amount: Number(pendingOrder.TotalPrice),
    description: 'Skin Dora Shop',
    bankcode: '',
    callback_url: 'https://0d6133ca891c.ngrok-free.app/payment/zalopay_callbacks'
  }

  await redisClient.set(order.apptransid, orderid.toString(), { EX: 900 })

  const data = [
    order.appid,
    order.apptransid,
    order.appuser,
    order.amount,
    order.apptime,
    order.embeddata,
    order.item
  ].join('|')

  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString()

  try {
    const response = await axios.post(config.endpoint, null, {
      params: order
    })
    res.status(200).json(response.data)
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'ZaloPay order creation failed' })
  }
}

export default createOrder
