import { ObjectId } from 'mongodb'

interface OrderDetailType {
  _id?: ObjectId
  ProductID?: ObjectId
  OrderID?: ObjectId
  Quantity?: string
  UnitPrice?: string
}

export default class OrderDetail {
  _id?: ObjectId
  ProductID?: ObjectId
  OrderID?: ObjectId
  Quantity?: string
  UnitPrice?: string

  constructor(orderDetail: OrderDetailType) {

    this._id = orderDetail._id || new ObjectId()
    this.ProductID = orderDetail.ProductID
    this.OrderID = orderDetail.OrderID
    this.Quantity = orderDetail.Quantity || ''
    this.UnitPrice = orderDetail.UnitPrice || ''
  }
}
