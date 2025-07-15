import { RegisterReqBody, UpdateMeReqBody } from '~/models/requests/Users.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { signToken, verifyToken } from '~/utils/jwt'
import { Role, TokenType, UserVerifyStatus } from '~/constants/enums'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { USERS_MESSAGES } from '~/constants/messages'
import axios from 'axios'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import nodemailer from 'nodemailer'
import { readEmailTemplate } from '~/utils/email-templates'

class UsersService {
  private async getOAuthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post(`https://oauth2.googleapis.com/token`, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }

  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      email_verified: boolean
      given_name: string
      family_name: string
      picture: string
    }
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerificationToken, verify },
      options: { expiresIn: '1d' },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
    })
  }

  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, verify },
      options: { expiresIn: '30m' },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
  }

  private signRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return signToken({
        payload: { user_id, token_type: TokenType.RefreshToken, verify, exp },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    } else {
      return signToken({
        payload: { user_id, token_type: TokenType.RefreshToken, verify },
        options: { expiresIn: '7d' },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
  }

  private signAccessAndRefreshTokens({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      options: { expiresIn: '1d' },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
    })
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async register(payload: RegisterReqBody, randomPassword?: string) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        username: `user${user_id.toString()}`,
        email_verify_token,
        password: hashPassword(payload.password),
        roleid: Role.User
      })
    )
    const [access_token, refresh_token] = await this.signAccessAndRefreshTokens({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

    const { exp, iat } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        exp,
        iat
      })
    )
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_PASSWORD_APP
        }
      })

      if (randomPassword) {
        const htmlContent = readEmailTemplate('google-register-success.html', {
          userName: payload.first_name,
          email: payload.email,
          password: randomPassword,
          loginURL: `${process.env.FRONTEND_URL}/login`
        })

        const mailOptions = {
          from: `"SKINDORA" <${process.env.EMAIL_APP}>`,
          to: payload.email,
          subject: 'Chào mừng bạn đến với SKINDORA - Thông tin tài khoản của bạn',
          html: htmlContent
        }
        transporter.sendMail(mailOptions)
        console.log('Google registration success email sent to:', payload.email)
      }

      const verifyURL = `${process.env.FRONTEND_URL}/auth/verify-email?email_verify_token=${email_verify_token}` // Đường dẫn xác nhận email

      const htmlContent = readEmailTemplate('verify-email.html', {
        first_name: payload.first_name,
        verifyURL: verifyURL
      })

      const mailOptions = {
        from: `"SKINDORA" <${process.env.EMAIL_APP}>`,
        to: payload.email,
        subject: 'Xác nhận đăng ký tài khoản SKINDORA',
        html: htmlContent //truyền nội dung html vào
      }

      transporter.sendMail(mailOptions)
      console.log('Email verification sent successfully to:', payload.email)
    } catch (error) {
      console.error('Error sending email:', error)
    }
    return { access_token, refresh_token }
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshTokens({
      user_id,
      verify
    })
    const { exp, iat } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        exp,
        iat
      })
    )
    return { access_token, refresh_token }
  }

  async forgotPassword({
    user_id,
    verify,
    email,
    first_name
  }: {
    user_id: string
    verify: UserVerifyStatus
    email: string
    first_name: string
  }) {
    const forgot_password_token = await this.signForgotPasswordToken({
      user_id,
      verify
    })
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])

    //mail
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_PASSWORD_APP
        }
      })

      // const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${forgot_password_token}`
      const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password?token=${forgot_password_token}`

      const htmlContent = readEmailTemplate('forgot-password.html', {
        userName: first_name,
        resetURL: resetURL
      })

      const mailOptions = {
        from: `"SKINDORA" <${process.env.EMAIL_APP}>`,
        to: email,
        subject: 'Yêu cầu đặt lại mật khẩu cho tài khoản SKINDORA',
        html: htmlContent
      }

      transporter.sendMail(mailOptions)
      console.log('Forgot password email sent successfully to:', email)
    } catch (error) {
      console.error('Error sending forgot-password email:', error)
    }
    return { message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
  }

  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          password: hashPassword(password),
          forgot_password_token: '',
          updated_at: '$$NOW'
        }
      }
    ])
    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS }
  }

  async verifyEmail(user_id: string) {
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          verify: UserVerifyStatus.Verified,
          email_verify_token: '',
          updated_at: '$$NOW'
        }
      }
    ])
    const [access_token, refresh_token] = await this.signAccessAndRefreshTokens({
      user_id,
      verify: UserVerifyStatus.Verified
    })
    const { exp, iat } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        exp,
        iat
      })
    )
    return { access_token, refresh_token }
  }

  async resendEmailVerify(user_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Unverified
    })
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token,
          updated_at: '$$NOW'
        }
      }
    ])
    //mail
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_PASSWORD_APP
        }
      })
      const verifyURL = `${process.env.FRONTEND_URL}/auth/verify-email?email_verify_token=${email_verify_token}`

      // Sử dụng template 'resend-verify-email.html'
      const htmlContent = readEmailTemplate('resend-verify-email.html', {
        userName: user.first_name, //Truyền tên người dùng vào template
        verifyURL: verifyURL
      })

      const mailOptions = {
        from: `"SKINDORA" <${process.env.EMAIL_APP}>`,
        to: user.email, //Gửi đến email của người dùng
        subject: 'Yêu cầu gửi lại email xác thực tài khoản SKINDORA',
        html: htmlContent
      }

      transporter.sendMail(mailOptions)
      console.log('Resend verification email sent successfully to:', user.email)
    } catch (error) {
      console.error('Error sending resend-verification email:', error)
    }
    return { message: USERS_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS }
  }

  async changePassword(user_id: string, password: string) {
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          password: hashPassword(password),
          forgot_password_token: '',
          updated_at: '$$NOW'
        }
      }
    ])
    return {
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS }
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const _payload = payload
    try {
      const user = await databaseService.users.findOneAndUpdate(
        { _id: new ObjectId(user_id) },
        [
          {
            $set: {
              ..._payload,
              updated_at: '$$NOW'
            }
          }
        ],
        {
          returnDocument: 'after',
          projection: {
            password: 0,
            email_verify_token: 0,
            forgot_password_token: 0
          }
        }
      )
      return user
    } catch (error) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.UPDATE_ME_ERROR,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    exp: number
  }) {
    const [access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp })
    ])
    const { iat } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token, exp, iat })
    )
    return { access_token: access_token, refresh_token: new_refresh_token }
  }

  async oAuth(code: string) {
    const { access_token, id_token } = await this.getOAuthGoogleToken(code)
    const userInfor = await this.getGoogleUserInfo(access_token, id_token)
    if (!userInfor.email_verified) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const user = await databaseService.users.findOne({ email: userInfor.email })
    if (user) {
      const [access_token, refresh_token] = await this.signAccessAndRefreshTokens({
        user_id: user._id.toString(),
        verify: user.verify
      })
      const { exp, iat } = await this.decodeRefreshToken(refresh_token)
      await databaseService.refreshTokens.insertOne(
        new RefreshToken({ user_id: user._id, token: refresh_token, exp, iat })
      )
      return {
        access_token,
        refresh_token,
        new_user: 0,
        verify: user.verify
      }
    } else {
      const password = hashPassword(Math.random().toString(36).slice(1, 15))
      const data = await this.register({
        email: userInfor.email,
        first_name: userInfor.given_name,
        last_name: userInfor.family_name,
        password: password,
        confirm_password: password,
        avatar: userInfor.picture
      },  password)
      return {
        ...data,
        new_user: 1,
        verify: UserVerifyStatus.Unverified
      }
    }
  }

  async getAllUser() {
    try {
      const users = await databaseService.users.find({}).toArray()
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  async getUserDetail(_id: string) {
    //tìm user dựa vào username
    const user = await databaseService.users.findOne({
      _id: new ObjectId(_id)
    })
    if (user == null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return user
  }

  async updateUserState(userIdToUpdate: string, newStatus: UserVerifyStatus, adminId: string) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)
    const result = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(userIdToUpdate) },
      {
        $set: {
          verify: newStatus,
          updated_at: localTime
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return result
  }
}

const usersService = new UsersService()
export default usersService
