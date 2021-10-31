import { AxiosResponse } from 'axios'
export interface BaseListModel<T> {
  total: number
  list: T[]
}

export interface BaseResponseModel<T> {
  code: number
  message: string
  data: T
}

export type APIResponseType<T> = Promise<AxiosResponse<BaseResponseModel<T>>>

export interface BasePageParams {
  pageNum: number
  pageSize: number
  [prop: string]: string | number
}
