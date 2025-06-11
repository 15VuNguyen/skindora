export interface ISuccessResponse<T> {
  success: true
  message: string
  data: T
}

export interface IErrorResponse {
  success: false
  message: string
  error?: any
}

//Dùng cho payload của các API phân trang
export interface IPaginatedData<T> {
  data: T[]
  pagination: {
    limit: number
    currentPage: number
    totalPages: number
    totalRecords: number
  }
}
