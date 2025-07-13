import { Request, Response } from 'express'
import redisClient from '../redis.services'
import { ObjectId } from 'mongodb'
import ordersService from '../orders.services'

export const zaloPayCallback = async (req: Request, res: Response) => {
  try {
    const { apptransid } = req.query

    const redisOrderId = (await redisClient.get(apptransid as string)) || ''

    await ordersService.saveOrderToDB(new ObjectId(redisOrderId))

    await redisClient.del(apptransid as string)

    res.redirect(`${process.env.FRONTEND_URL}?status=success`)
  } catch (error) {
    console.error('ZaloPay Return Error:', error)
    return res.redirect(`${process.env.FRONTEND_URL}?status=error`)
  }
}
