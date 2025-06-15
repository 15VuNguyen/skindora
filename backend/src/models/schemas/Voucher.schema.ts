import { ObjectId } from 'mongodb'
import { DiscountType } from '~/constants/enums'

export interface VoucherType {
  _id?: ObjectId
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  maxDiscountAmount?: number
  minOrderValue?: number
  startDate: Date
  endDate: Date
  usageLimit?: number
  usedCount?: number
  userUsageLimit?: number
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class Voucher {
  _id?: ObjectId
  code: string
  description: string
  discountType: DiscountType
  discountValue: number
  maxDiscountAmount: number
  minOrderValue: number
  startDate: Date
  endDate: Date
  usageLimit: number
  usedCount: number
  userUsageLimit: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  constructor(voucher: VoucherType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = voucher._id || new ObjectId()
    this.code = voucher.code.toUpperCase().trim()
    this.description = voucher.description ?? ''
    this.discountType = voucher.discountType
    this.discountValue = voucher.discountValue
    this.maxDiscountAmount = voucher.maxDiscountAmount ?? 0
    this.minOrderValue = voucher.minOrderValue ?? 0
    this.startDate = new Date(voucher.startDate)
    this.endDate = new Date(voucher.endDate)
    this.usageLimit = voucher.usageLimit ?? 0 // giới hạn số lần voucher có thể sử dụng toàn hệ thống
    this.usedCount = voucher.usedCount ?? 0 // số lần voucher đã được sử dụng thực tế
    this.userUsageLimit = voucher.userUsageLimit ?? 1 // giới hạn mỗi user chỉ được sử dụng 1 lần
    this.isActive = voucher.isActive ?? true
    this.createdAt = voucher.createdAt || localTime
    this.updatedAt = voucher.updatedAt || localTime
  }
}
