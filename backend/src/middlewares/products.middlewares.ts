import { ObjectId } from "mongodb"
import HTTP_STATUS from "~/constants/httpStatus"
import { PRODUCTS_MESSAGES } from "~/constants/messages"
import { ErrorWithStatus } from "~/models/Errors"
import databaseService from "~/services/database.services"


export const validateProductExists = async(productId: string) => {
  if (!ObjectId.isValid(productId)) {
    throw new ErrorWithStatus({
      message: PRODUCTS_MESSAGES.INVALID_PRODUCT_ID,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  const product = await databaseService.products.findOne({ _id: new ObjectId(productId) })
  if (!product) {
    throw new ErrorWithStatus({
      message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND.replace('%s', productId),
      status: HTTP_STATUS.NOT_FOUND
    })
  }
  return product
}