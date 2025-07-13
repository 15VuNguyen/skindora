import { ObjectId } from 'mongodb'
import {
  CancelRequestStatus,
  DiscountType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  RefundStatus
} from '~/constants/enums'
import { getBaseRequiredDate, getLocalTime } from '~/utils/date'

export interface CancelRequest {
  status: CancelRequestStatus
  reason: string
  requestedAt: Date
  approvedAt?: Date
  rejectedAt?: Date
  staffId: ObjectId
  staffNote?: string
}

export interface VoucherSnapshot {
  code: string
  discountType: DiscountType
  discountValue: number
  maxDiscountAmount?: number
}

interface OrderType {
  _id?: ObjectId
  UserID?: ObjectId
  RecipientName?: string
  PhoneNumber?: string
  ShipAddress?: string
  Description?: string
  OrderDate?: string
  RequireDate?: string
  ShippedDate?: string
  Status?: OrderStatus
  PaymentMethod?: PaymentMethod
  PaymentStatus?: PaymentStatus
  CancelRequest?: CancelRequest
  RefundStatus?: RefundStatus
  DiscountValue?: string
  VoucherSnapshot?: VoucherSnapshot
  TotalPrice?: string
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId
}

export default class Order {
  _id?: ObjectId
  UserID?: ObjectId
  RecipientName?: string
  PhoneNumber?: string
  ShipAddress?: string
  Description?: string
  OrderDate?: string
  RequireDate?: string
  ShippedDate?: string
  Status?: OrderStatus
  PaymentMethod?: PaymentMethod
  PaymentStatus?: PaymentStatus
  CancelRequest?: CancelRequest
  RefundStatus?: RefundStatus
  DiscountValue?: string
  VoucherSnapshot?: VoucherSnapshot
  TotalPrice?: string
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId

  constructor(order: OrderType) {
    this._id = order._id || new ObjectId()
    this.UserID = order.UserID
    this.RecipientName = order.RecipientName || ''
    this.PhoneNumber = order.PhoneNumber || ''
    this.ShipAddress = order.ShipAddress || ''
    this.Description = order.Description || ''
    this.OrderDate = order.OrderDate || getLocalTime().toISOString()
    this.RequireDate = order.RequireDate || getBaseRequiredDate().toISOString()
    this.ShippedDate = order.ShippedDate || ''
    this.Status = order.Status || OrderStatus.PENDING
    this.PaymentMethod = order.PaymentMethod || PaymentMethod.COD
    this.PaymentStatus = order.PaymentStatus || PaymentStatus.UNPAID
    this.CancelRequest = order.CancelRequest
    this.RefundStatus = order.RefundStatus || RefundStatus.NONE
    this.DiscountValue = order.DiscountValue || ''
    this.VoucherSnapshot = order.VoucherSnapshot
    this.TotalPrice = order.TotalPrice || ''
    this.created_at = order.created_at || getLocalTime()
    this.updated_at = order.updated_at || getLocalTime()
    this.modified_by = order.modified_by
  }
}
