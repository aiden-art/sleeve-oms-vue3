import $axios from '@/request'
import { APIResponseType, BaseListModel, BasePageParams } from './apiTypes'

export interface GridCategoryModel {
  id?: number
  title: string
  img: string
  categoryId: number | undefined
  rootCategoryId: number | undefined
  index: number
}

export const getGridCategoryListApi = (data?: BasePageParams): APIResponseType<BaseListModel<GridCategoryModel>> => {
  return $axios({
    method: 'get',
    url: '/v1/grid-category/list',
    data,
  })
}

export const getGridCategoryDetailApi = (id: number): APIResponseType<GridCategoryModel> => {
  return $axios({
    method: 'get',
    url: `/v1/grid-category/${id}`,
  })
}

export const createGridCategoryApi = (data: GridCategoryModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/grid-category/create',
    data,
  })
}

export const deleteGridCategoryApi = (id: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/grid-category/${id}`,
  })
}

export const updateGridCategoryApi = (data: GridCategoryModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/grid-category/update',
    data,
  })
}
