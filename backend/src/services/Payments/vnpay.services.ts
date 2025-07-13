import moment from 'moment'
import crypto from 'crypto'
import querystring from 'qs'
import redisClient from '../redis.services'

interface PaymentData {
  amount: number
  bankCode?: string
  language?: string
  orderDescription?: string
  orderType?: string
}

interface VnpParams {
  [key: string]: string | number
}

function sortObject(obj: VnpParams): VnpParams {
  const sorted: VnpParams = {}
  const str = Object.keys(obj).sort()
  for (const key of str) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      sorted[key] = encodeURIComponent(String(obj[key])).replace(/%20/g, '+')
    }
  }
  return sorted
}

export const createPaymentUrl = async (data: PaymentData, clientIp: string, redisOrderId: string): Promise<string> => {
  const date = new Date()
  const createDate = moment(date).format('YYYYMMDDHHmmss')
  const orderId = moment(date).format('HHmmss')

  const tmnCode = process.env.VNPAY_TMN_CODE!
  const secretKey = process.env.VNPAY_HASHSECRET!
  const vnpUrl = process.env.VNP_URL!
  const returnUrl = process.env.VNP_RETURNURL!

  const { amount, bankCode, language = 'vn', orderDescription, orderType = 'other' } = data

  const vnp_Params: VnpParams = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: language,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDescription ?? `Thanh toan don hang ${orderId}`,
    vnp_OrderType: orderType,
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: clientIp,
    vnp_CreateDate: createDate
  }

  if (bankCode) vnp_Params['vnp_BankCode'] = bankCode

  await redisClient.set(orderId, redisOrderId, { EX: 900 })

  const sortedParams = sortObject(vnp_Params)
  const signData = querystring.stringify(sortedParams, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  const finalParams = {
    ...sortedParams,
    vnp_SecureHash: signed
  }

  console.log(finalParams)

  return vnpUrl + '?' + querystring.stringify(finalParams, { encode: false })
}
