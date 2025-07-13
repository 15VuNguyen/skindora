import { Request, Response } from 'express'
import crypto from 'crypto'
import querystring from 'qs'
import redisClient from '../redis.services'
import ordersService from '../orders.services'
import { ObjectId } from 'mongodb'

export const vnpayReturn = async (req: Request, res: Response) => {
  const vnp_Params = { ...req.query }

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
