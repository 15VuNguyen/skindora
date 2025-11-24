import { Request, Response, NextFunction } from 'express'
import { Collection, Document, Filter, Document as Projection } from 'mongodb'

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
  filter: Filter<T> = {},
  projection: Projection = {},
) => {
  try {
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const skip = (page - 1) * limit

    const [totalRecords, data] = await Promise.all([
      collection.countDocuments(filter),
      collection.find(filter, { projection }).sort({ created_at: -1 }).skip(skip).limit(limit).toArray()
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

export const sendPaginatedResponseFromRedis = <T>(
  res: Response,
  next: NextFunction,
  data: T[],
  query: Record<string, any>
) => {
  try {
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const start = (page - 1) * limit

    const paginatedData = data.slice(start, start + limit)

    const responseBody: IResponseSearch<any> = {
      data: paginatedData,
      pagination: {
        limit,
        currentPage: page,
        totalPages: Math.ceil(data.length / limit),
        totalRecords: data.length
      }
    }

    return res.status(200).json(responseBody)
  } catch (error) {
    next(error)
  }
}

export const sendPaginatedWithExtraPinelineResponse = async <T extends Document>(
  res: Response,
  next: NextFunction,
  collection: Collection<T>,
  query: Request['query'],
  filter: Filter<T> = {},
  projection: Projection = {},
  extraPipeline: any[] = []
) => {
  try {
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const skip = (page - 1) * limit

    const pipeline: any[] = [
      { $match: filter },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit },
      ...extraPipeline
    ]

    if (projection && Object.keys(projection).length > 0) {
      pipeline.push({ $project: projection })
    }

    const [totalRecords, data] = await Promise.all([
      collection.countDocuments(filter),
      collection.aggregate(pipeline).toArray()
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

