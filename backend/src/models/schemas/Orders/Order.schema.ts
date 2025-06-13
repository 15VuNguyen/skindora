import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enums'

interface OrderType {
  _id?: ObjectId
  UserID?: ObjectId
  ShipAddress?: string
  Description?: string
  RequireDate?: string
  ShippedDate?: string
  Status?: OrderStatus
  Discount?: string
  TotalPrice?: string
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId
}

export default class Order {
  _id?: ObjectId
  UserID?: ObjectId
  ShipAddress?: string
  Description?: string
  RequireDate?: string
  ShippedDate?: string
  Status?: OrderStatus
  Discount?: string
  TotalPrice?: string
  created_at?: Date
  updated_at?: Date
  modified_by?: ObjectId

  constructor(order: OrderType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = order._id || new ObjectId()
    this.UserID = order.UserID
    this.ShipAddress = order.ShipAddress || ''
    this.Description = order.Description || ''
    this.RequireDate = order.RequireDate || ''
    this.ShippedDate = order.ShippedDate || ''
    this.Status = order.Status || OrderStatus.PENDING
    this.Discount = order.Discount || ''
    this.TotalPrice = order.TotalPrice || ''
    this.created_at = localTime || order.created_at
    this.updated_at = localTime || order.updated_at
    this.modified_by = order.modified_by
  }
}
