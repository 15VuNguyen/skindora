import { CreateNewVoucherReqBody, UpdateVoucherReqBody } from '~/models/requests/Vouchers.request'
import databaseService from './database.services'
import Voucher, { VoucherType } from '~/models/schemas/Voucher.schema'
import { ObjectId } from 'mongodb'

class VouchersService {
  async createNewVoucher(reqBody: CreateNewVoucherReqBody) {
    return await databaseService.vouchers.insertOne(
      new Voucher({
        _id: new ObjectId(),
        code: reqBody.code,
        description: reqBody.description,
        discountType: reqBody.discountType,
        discountValue: reqBody.discountValue,
        maxDiscountAmount: reqBody.maxDiscountAmount,
        minOrderValue: reqBody.minOrderValue,
        startDate: reqBody.startDate,
        endDate: reqBody.endDate,
        usageLimit: reqBody.usageLimit,
        userUsageLimit: reqBody.userUsageLimit
      })
    )
  }

  async updateVoucher(voucherId: string, reqBody: UpdateVoucherReqBody) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)
    return await databaseService.vouchers.findOneAndUpdate(
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
  }

  async inactiveVoucher(voucherId: string, voucher?: VoucherType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)
    return await databaseService.vouchers.findOneAndUpdate(
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
  }
}

const voucherService = new VouchersService()
export default voucherService
