import { TokenPayLoad } from './models/requests/Users.requests'
import User from './models/schemas/User.schema'
import { Request } from 'express'
import { VoucherType } from './models/schemas/Voucher.schema'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
    decoded_email_verify_token?: TokenPayLoad
    decoded_forgot_password_token?: TokenPayLoad
    voucher?: VoucherType
  }
}
