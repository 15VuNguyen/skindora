import { Router } from 'express'
import { wrapAsync } from '~/utils/handler'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import {
  addNewReviewController,
  updateReviewController,
  removeReviewController,
  getReviewController
} from '~/controllers/products.controllers'
import { addNewReviewValidator, updateReviewValidator, removeReviewValidator } from '~/middlewares/reviews.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { AddNewReviewReqBody, UpdateReviewReqBody } from '~/models/requests/Reviews.request'

const reviewRouters = Router()

reviewRouters.post(
  '/:orderId/products/:productId/review',
  accessTokenValidator,
  filterMiddleware<AddNewReviewReqBody>(['rating', 'comment', 'images', 'videos']),
  addNewReviewValidator,
  wrapAsync(addNewReviewController)
)
reviewRouters.put(
  '/:orderId/products/:productId/review',
  accessTokenValidator,
  filterMiddleware<UpdateReviewReqBody>(['rating', 'comment', 'images', 'videos']),
  updateReviewValidator,
  wrapAsync(updateReviewController)
)
reviewRouters.delete(
  '/:orderId/products/:productId/review',
  accessTokenValidator,
  removeReviewValidator,
  wrapAsync(removeReviewController)
)
reviewRouters.get('/:productId/review', wrapAsync(getReviewController))

export default reviewRouters
