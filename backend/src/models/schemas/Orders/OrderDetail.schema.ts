import { ObjectId } from 'mongodb'

interface OrderDetailType {
  _id?: ObjectId
  ProductID?: ObjectId
  OrderID?: ObjectId
  Quantity?: string
  OrderDate?: Date
  UnitPrice?: string
}

export default class OrderDetail {
  _id?: ObjectId
  ProductID?: ObjectId
  OrderID?: ObjectId
  Quantity?: string
  OrderDate?: Date
  UnitPrice?: string

  constructor(orderDetail: OrderDetailType) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    this._id = orderDetail._id || new ObjectId()
    this.ProductID = orderDetail.ProductID
    this.OrderID = orderDetail.OrderID
    this.Quantity = orderDetail.Quantity || ''
    this.OrderDate = localTime || orderDetail.OrderDate
    this.UnitPrice = orderDetail.UnitPrice || ''
  }
}
