import axios from 'axios'
import CryptoJS from 'crypto-js'
import { v1 as uuidv1 } from 'uuid'
import moment from 'moment'
import cartService from '../cart.services'

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
  const cartKey = cartService.getCartKey(req.decoded_authorization)
  const cart = cartService.getCart(cartKey)

  const embeddata = {
    redirecturl: process.env.FRONTEND_URL,
    orderDetails: req.body.orderDetails
  }

  const orderDetails = req.body.orderDetails

  if (!Array.isArray(orderDetails) || orderDetails.length === 0 || !orderDetails) {
    return res.status(400).json({ error: 'OrderDetails is required and must be a non-empty array.' })
  }

  const items: Item[] = orderDetails.map((item: any) => ({
    _id: item._id,
    productID: item.ProductID,
    quantity: item.Quantity,
    discount: item.Discount
  }))

  const order: Order = {
    appid: config.app_id,
    apptransid: `${moment().format('YYMMDD')}_${uuidv1()}`,
    appuser: 'Skin Dora Shop',
    apptime: Date.now(),
    item: JSON.stringify(items),
    embeddata: JSON.stringify(embeddata),
    amount: req.body.total,
    description: 'Skin Dora Shop',
    bankcode: '',
    callback_url: process.env.VNP_IPNURL
  }

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
