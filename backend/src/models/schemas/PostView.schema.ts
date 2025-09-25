import { ObjectId } from 'mongodb'
import { getLocalDay, getLocalTime } from '~/utils/date'

export interface PostViewType {
  _id?: ObjectId
  postId: ObjectId
  date: Date
  views: number
  created_at?: Date
  updated_at?: Date
}

export default class PostView {
  _id?: ObjectId
  postId: ObjectId
  date: Date
  views: number
  created_at: Date
  updated_at: Date

  constructor(data: PostViewType) {
    const now = getLocalTime()

    this._id = data._id ?? new ObjectId()
    this.postId = data.postId
    this.date = data.date || getLocalDay()   
    this.views = data.views ?? 0
    this.created_at = data.created_at ?? now
    this.updated_at = data.updated_at ?? now
  }
}
