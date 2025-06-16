import { ObjectId } from "mongodb";
import { OrderStatus, OrderType } from "~/constants/enums";

export interface OrderReqBody {
  UserID: string
  ProductID: Array<string>
  ShipAddress: string
  Description?: string
  RequireDate: string
  ShippedDate: string
  Discount?: string
  Status: OrderStatus
  type?: OrderType 
}

export interface OrderParams{
  orderId: string
}

export interface BuyNowReqBody{
  productId: string,
  quantity: number
}

export interface ProductInOrder{
    ProductID: string,
    Quantity: number,
    PricePerUnit: number,
    TotalPrice: number
}
export interface TempOrder{
  UserID: ObjectId | string,
  Products: Array<ProductInOrder>,
  TotalPrice: number,
  CreatedAt: Date
}

export interface PrepareOrderPayload{
  selectedProductIDs: Array<string>
}

