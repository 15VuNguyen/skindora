import { TokenPayLoad } from './models/requests/Users.requests'
import Order from './models/schemas/Orders/Order.schema'
import Product from './models/schemas/Products/Product.schema'
import User from './models/schemas/User.schema'
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
    decoded_email_verify_token?: TokenPayLoad
    decoded_forgot_password_token?: TokenPayLoad
    product?: Product
    order?: Order
  }
}
