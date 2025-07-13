import { Router } from 'express'
import {
  changePasswordController,
  emailVerifyTokenController,
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  oAuthController,
  refreshController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordTokenController,
  
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator,
  addToWishListValidator,
  removeFromWishListValidator
} from '~/middlewares/users.middlewares'
import {
  addToWishListController,
  getWishListController,
  removeFromWishListController,getProductFromWishListController
} from '~/controllers/products.controllers'
import { UpdateMeReqBody } from '~/models/requests/Users.requests'
import { wrapAsync } from '~/utils/handler'
import { getAllVoucherController, getVoucherDetailController } from '~/controllers/voucher.controllers'

const usersRouter = Router()
// usersRouter.route('/').get(loginController)
// usersRouter.route('/').get(loginController)

usersRouter.post('/login', loginValidator, wrapAsync(loginController))
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)
usersRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
)

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyTokenController))
usersRouter.post('/addToWishList', accessTokenValidator, addToWishListValidator, wrapAsync(addToWishListController))
usersRouter.put(
  '/removeFromWishList',
  accessTokenValidator,
  removeFromWishListValidator,
  wrapAsync(removeFromWishListController)
)
usersRouter.get('/getWishList', accessTokenValidator, wrapAsync(getWishListController))
usersRouter.get('/wishlist-products', accessTokenValidator, wrapAsync(getProductFromWishListController))
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapAsync(changePasswordController)
)
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
usersRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))
usersRouter.patch(
  '/me',
  accessTokenValidator,
  filterMiddleware<UpdateMeReqBody>(['first_name', 'last_name', 'location', 'username', 'avatar',"phone_number"]),
  updateMeValidator,
  wrapAsync(updateMeController)
)
usersRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(refreshController))
usersRouter.get('/oauth/google', wrapAsync(oAuthController))
usersRouter.get('/vouchers', wrapAsync(getAllVoucherController))
usersRouter.get('/vouchers/:voucherId', wrapAsync(getVoucherDetailController))
export default usersRouter
