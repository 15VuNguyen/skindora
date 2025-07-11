import { Request, Response } from 'express'
import crypto from 'crypto'
import querystring from 'qs'
import redisClient from '../redis.services'
import ordersService from '../orders.services'
import { ObjectId } from 'mongodb'

export const vnpayReturn = async (req: Request, res: Response) => {
  const vnp_Params = { ...req.query }

  const secureHash = vnp_Params['vnp_SecureHash'] as string
  delete vnp_Params['vnp_SecureHash']
  delete vnp_Params['vnp_SecureHashType']

  const secretKey = process.env.VNPAY_HASHSECRET!
  const sortedParams = Object.fromEntries(
    Object.entries(vnp_Params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, String(v)])
  )

  const signData = querystring.stringify(sortedParams, { encode: false })
  const hmac = crypto.createHmac('sha512', secretKey)
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  if (secureHash !== signed) {
    res.status(400).send('Sai checksum')
    return
  }

  const vnpTxnRef = String(req.query['vnp_TxnRef'] || '')
  const responseCode = vnp_Params['vnp_ResponseCode']

  if (responseCode === '00') {
    const redisOrderId = await redisClient.get(vnpTxnRef)

    if (redisOrderId) {
      await ordersService.saveOrderToDB(new ObjectId(redisOrderId))
    }

    res.redirect(`${process.env.FRONTEND_URL}`)
  }
}
