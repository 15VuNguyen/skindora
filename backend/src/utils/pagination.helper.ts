import { Request, Response, NextFunction } from 'express'
import { Collection, Document, Filter } from 'mongodb'

export interface IResponseSearch<T> {
  data: T[]
  pagination: {
    limit: number
    currentPage: number
    totalPages: number
    totalRecords: number
  }
}

export const sendPaginatedResponse = async <T extends Document>(
  res: Response,
  next: NextFunction,
  collection: Collection<T>,
  query: Request['query'],
  filter: Filter<T> = {}
) => {
  try {
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const skip = (page - 1) * limit

    const [totalRecords, data] = await Promise.all([
      collection.countDocuments(filter),
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()
    ])

    const totalPages = Math.ceil(totalRecords / limit)

    const responseBody: IResponseSearch<any> = {
      data,
      pagination: {
        limit,
        currentPage: page,
        totalPages,
        totalRecords
      }
    }

    return res.status(200).json(responseBody)
  } catch (error) {
    next(error)
  }
}
