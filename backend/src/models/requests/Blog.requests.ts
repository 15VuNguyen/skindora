import { ObjectId } from "mongodb"
import { BlogPostState } from "~/constants/enums"

export interface CreateNewPostReqBody {
    title: string
    slug: string
    content: string
    status: BlogPostState
    authorId: ObjectId
}

export interface UpdatePostReqBody {
    title?: string
    slug?: string
    content?: string
    status?: BlogPostState
}

export interface PostParam {
    id: string
}