import { TokenPayLoad } from './models/requests/Users.requests'
import Order from './models/schemas/Orders/Order.schema'
import Product from './models/schemas/Products/Product.schema'
import User from './models/schemas/User.schema'
import { Request } from 'express'
import { VoucherType } from './models/schemas/Voucher.schema'
import { Cart } from './models/requests/Cart.requests'
import { ObjectId } from 'mongodb'
import Post from './models/schemas/Blog.schema'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
    decoded_email_verify_token?: TokenPayLoad
    decoded_forgot_password_token?: TokenPayLoad
    product?: Product
    order?: Order
    voucher?: VoucherType
    cart?: Cart
    products?: Array<Product>
    redis_order_id?: ObjectId
    product_ids?: ObjectId[] 
    post?: Post
  }
}
