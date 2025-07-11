import { Request, Response } from 'express'
import redisClient from '../redis.services'
import { ObjectId } from 'mongodb'
import ordersService from '../orders.services'

export const zaloPayCallback = async (req: Request, res: Response) => {
  try {
    const { apptransid, status } = req.body

    console.log('ZaloPay callback body:', req.body)

    if (!apptransid || status != 1) {
      res.status(400).json({ return_code: -1, return_message: 'Invalid or unpaid transaction' })
      return
    }

    const redisOrderId = await redisClient.get(apptransid)

    if (!redisOrderId) {
      res.status(404).json({ return_code: -1, return_message: 'OrderId not found in Redis' })
      return
    }

    await ordersService.saveOrderToDB(new ObjectId(redisOrderId))

    res.status(200).json({ return_code: 1, return_message: 'Success' })
  } catch (error) {
    console.error('ZaloPay Callback Error:', error)
    res.status(500).json({ return_code: -1, return_message: 'Internal error' })
  }
}
