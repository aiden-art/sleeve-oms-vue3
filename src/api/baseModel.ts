export interface BaseListModel<T> {
  total: number
  items: T[]
  page: number
  count: number
}

export interface BaseResponseModel {
  code: number
  message: string
  request: string
}
