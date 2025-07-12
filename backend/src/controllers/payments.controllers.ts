import { Request, Response } from 'express'
import { createPaymentUrl } from '~/services/Payments/vnpay.services'

export const createPaymentUrlController = (req: Request, res: Response): void => {
  const clientIp =
    (req.headers['x-forwarded-for'] as string) ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    (req.connection as any)?.socket?.remoteAddress ||
    '127.0.0.1'

  try {
    const paymentUrl = createPaymentUrl(req.body, clientIp || '', req.redis_order_id?.toString() || '')
    res.status(200).json({ message: 'uccess', data: { paymentUrl } })
  } catch (error) {
    console.error('Error creating payment URL:', error)
    res.status(500).json({ message: 'Error creating payment URL' })
  }
}

export const paymentReturn = (req: Request, res: Response): void => {
  console.log('callbackurl')

  res.redirect(process.env.FRONTEND_URL ?? 'https://skindora.site')
}
