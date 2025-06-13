import { Router } from 'express'
import { addToCartController, clearCartController, getCartController, removeFromCartController, updateCartController } from '~/controllers/cart.controllers'
import { addToCartValidator, removeProductFromCartValidator, updateCartValidator } from '~/middlewares/carts.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const cartRouter = Router()

cartRouter.route('/')
.get(accessTokenValidator, wrapAsync(getCartController))
.post(accessTokenValidator, addToCartValidator, wrapAsync(addToCartController))
.delete(accessTokenValidator, wrapAsync(clearCartController))

cartRouter.route('/:productId')
.patch(accessTokenValidator, updateCartValidator, wrapAsync(updateCartController))
.delete(accessTokenValidator, removeProductFromCartValidator, wrapAsync(removeFromCartController))


export default cartRouter
