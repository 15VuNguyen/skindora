import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { JwtPayload } from 'jsonwebtoken'

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export interface RegisterReqBody {
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
  avatar?: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface resetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface UpdateMeReqBody {
  first_name?: string
  last_name?: string
  location?: string
  username?: string
  phone_number?: string
  avatar?: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}
