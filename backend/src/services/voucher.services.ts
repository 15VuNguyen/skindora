import { CreateNewVoucherReqBody, UpdateVoucherReqBody } from '~/models/requests/Vouchers.request'
import databaseService from './database.services'
import Voucher, { VoucherType } from '~/models/schemas/Voucher.schema'
import { ObjectId } from 'mongodb'
import { sendMessage } from './Kafka/kafka.services'
import dotenv from 'dotenv'

dotenv.config()

class VouchersService {
  async createNewVoucher(reqBody: CreateNewVoucherReqBody) {
    const voucherId = new ObjectId()
    const topic = process.env.VOUCHER_CREATED ?? ''
    const voucher: Voucher = new Voucher({
      _id: voucherId,
      code: reqBody.code,
      description: reqBody.description,
      discountType: reqBody.discountType,
      discountValue: reqBody.discountValue,
      maxDiscountAmount: reqBody.maxDiscountAmount,
      minOrderValue: reqBody.minOrderValue,
      startDate: reqBody.startDate,
      endDate: reqBody.endDate,
      usageLimit: reqBody.usageLimit,
      userUsageLimit: reqBody.userUsageLimit,
      isActive: true
    })

    const result = await databaseService.vouchers.insertOne(voucher)

    await sendMessage(
      topic,
      voucherId.toHexString(),
      JSON.stringify({
        ...voucher,
        _id: voucherId.toHexString()
      })
    )
    return result
  }

  async getVoucherDetail(voucherId: string) {
    return await databaseService.vouchers.findOne({ _id: new ObjectId(voucherId) })
  }

  async updateVoucher(voucherId: string, reqBody: UpdateVoucherReqBody) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)
    const result = await databaseService.vouchers.findOneAndUpdate(
      {
        _id: new ObjectId(voucherId)
      },
      {
        $set: {
          ...reqBody,
          updatedAt: localTime
        }
      },
      { returnDocument: 'after' }
    )

    if (result) {
      const topic = process.env.VOUCHER_UPDATED ?? 'voucher_updated'
      await sendMessage(
        topic,
        result._id.toHexString(),
        JSON.stringify({
          ...result,
          _id: result._id.toHexString()
        })
      )
    }

    return result
  }

  async inactiveVoucher(voucherId: string, voucher?: VoucherType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)
    const result = await databaseService.vouchers.findOneAndUpdate(
      {
        _id: new ObjectId(voucherId)
      },
      {
        $set: {
          isActive: !voucher?.isActive,
          updatedAt: localTime
        }
      },
      { returnDocument: 'after' }
    )

    if (result) {
      const voucher = result
      const topic = process.env.VOUCHER_UPDATED ?? 'voucher_updated'
      await sendMessage(
        topic,
        voucher._id.toHexString(),
        JSON.stringify({
          ...voucher,
          _id: voucher._id.toHexString()
        })
      )
    }

    return result
  }
}

const voucherService = new VouchersService()
export default voucherService
