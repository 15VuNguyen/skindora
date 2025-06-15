import { DiscountType } from '~/constants/enums'

export interface CreateNewVoucherReqBody {
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  maxDiscountAmount?: number
  minOrderValue?: number
  startDate: Date
  endDate: Date
  usageLimit?: number
  userUsageLimit?: number
}

export interface UpdateVoucherReqBody {
  description?: string
  discountType: DiscountType
  discountValue: number
  maxDiscountAmount?: number
  minOrderValue?: number
  endDate: Date
  usageLimit?: number
  userUsageLimit?: number
}
