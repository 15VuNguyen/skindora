import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import _ from 'lodash'
import { AddNewReviewReqBody, UpdateReviewReqBody } from '~/models/requests/Reviews.request'
import FeedBack from '~/models/schemas/Reviewschema'

class ReviewService {
  async addReview(userID: string, orderID: string, productId: string, reqBody: AddNewReviewReqBody) {
    return await databaseService.reviews.insertOne(
      new FeedBack({
        _id: new ObjectId(),
        userID: new ObjectId(userID),
        productID: new ObjectId(productId),
        orderID: new ObjectId(orderID.toString()),
        rating: reqBody.rating,
        comment: reqBody.comment,
        images: reqBody.images || [],
        videos: reqBody.videos || []
      })
    )
  }

  async updateReview(userID: string, orderID: string, productId: string, reqBody: UpdateReviewReqBody) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    return await databaseService.reviews.findOneAndUpdate(
      {
        orderID: new ObjectId(orderID),
        productID: new ObjectId(productId),
        userID: new ObjectId(userID),
        isDeleted: false
      },
      {
        $set: {
          ...reqBody,
          modifiedAt: localTime
        }
      },
      { returnDocument: 'after' }
    )
  }

  async removeReview(userID: string, orderID: string, productId: string) {
    const currentDate = new Date()
    const vietnamTimezoneOffset = 7 * 60
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffset * 60 * 1000)

    return await databaseService.reviews.findOneAndUpdate(
      {
        userID: new ObjectId(userID.toString()),
        productID: new ObjectId(productId.toString()),
        orderID: new ObjectId(orderID.toString()),
        isDeleted: false
      },
      {
        $set: {
          isDeleted: true,
          modifiedAt: localTime
        }
      },
      { returnDocument: 'after' }
    )
  }

  async getReview(productId: string, currentPage = 1, limit = 10) {
    const skip = (currentPage - 1) * limit

    const result = await databaseService.reviews
      .aggregate([
        { $match: { productID: new ObjectId(productId), isDeleted: false } },
        {
          $facet: {
            data: [{ $sort: { rating: 1 } }, { $skip: skip }, { $limit: limit }],
            totalRecords: [{ $count: 'count' }]
          }
        }
      ])
      .toArray()

    const data = result[0]?.data || []
    const totalRecords = result[0]?.totalRecords[0]?.count || 0
    const totalPages = Math.ceil(totalRecords / limit)

    return {
      data,
      limit,
      currentPage,
      totalPages,
      totalRecords
    }
  }
}

const reviewService = new ReviewService()
export default reviewService
