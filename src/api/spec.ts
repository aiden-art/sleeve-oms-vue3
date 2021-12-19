import $axios from '@/request'
import { APIResponseType, BaseListModel, BasePageParams } from './apiTypes'

export interface SpecKeyModel {
  id?: number
  name: string
  unit: string
  standard: number
  description: string
  specValues?: SpecValueModel[]
}

export interface SpecValueModel {
  id?: number
  value: string
  specKeyId?: number
  extend: string
}

export const createSpecKeyApi = (data: SpecKeyModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/spec-key/create',
    data,
  })
}

export const updateSpecKeyApi = (data: SpecKeyModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/spec-key/update',
    data,
  })
}

export const deleteSpecKeyApi = (id: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/spec-key/${id}`,
  })
}

export const getSpecKeyApi = (id: number): APIResponseType<SpecKeyModel> => {
  return $axios({
    method: 'get',
    url: `/v1/spec-key/${id}`,
  })
}

export const getSpecKeyListApi = (data?: BasePageParams): APIResponseType<BaseListModel<SpecKeyModel>> => {
  return $axios({
    method: 'get',
    url: '/v1/spec-key/list',
    params: data,
  })
}

export const createSpecValueApi = (data: SpecValueModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/spec-value/create',
    data,
  })
}

export const updateSpecValueApi = (data: SpecValueModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/spec-value/update',
    data,
  })
}

export const deleteSpecValueApi = (id: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/spec-value/${id}`,
  })
}

export const getSpecValueApi = (id: number): APIResponseType<SpecValueModel> => {
  return $axios({
    method: 'get',
    url: `/v1/spec-value/${id}`,
  })
}
