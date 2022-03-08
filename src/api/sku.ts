import $axios from '@/request'
import { APIResponseType, BaseListModel, BasePageParams } from './apiTypes'

export interface SkuSpecModel {
  key: string
  keyId: undefined | number
  valueId: undefined | number
}

export interface SkuModel {
  id?: number
  price: number
  discountPrice: number
  online: number
  img: string
  title: string
  spuId?: number
  specs: SkuSpecModel[]
  code: string
  stock: number
  categoryId: number
  rootCategoryId: number
}

export const createSkuApi = (data: SkuModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/sku/create',
    data,
  })
}

export const updateSkuApi = (data: SkuModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/sku/update',
    data,
  })
}

export const deleteSkuApi = (id: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/sku/${id}`,
  })
}

export const getSkuApi = (id: number): APIResponseType<SkuModel> => {
  return $axios({
    method: 'get',
    url: `/v1/sku/${id}`,
  })
}

export const getSkuListApi = (data?: BasePageParams): APIResponseType<BaseListModel<SkuModel>> => {
  return $axios({
    method: 'get',
    url: `/v1/sku/list`,
    params: data,
  })
}
