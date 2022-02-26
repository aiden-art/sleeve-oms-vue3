import $axios from '@/request'
import { APIResponseType, BaseListModel, BasePageParams } from './apiTypes'

export interface SpuImg {
  id?: number
  spuId: number
  img: string
}

export interface SpuDetailImg {
  id?: number
  spuId: number
  img: string
  index: number
}

export interface SpuKey {
  id?: number
  spuId: number
  specKeyId: number
}

export interface SpuModel {
  id?: number
  title: string
  subtitle: string
  categoryId: number
  rootCategoryId: number
  online: number
  price: string
  sketchSpecId: number
  defaultSkuId: number
  img: string
  discountPrice: string
  description: string
  tags: string
  isTest: number
  spuThemeImg: string
  forThemeImg: string
  spuImgs?: SpuImg[]
  spudetailImgs?: SpuDetailImg[]
  spuKeys?: SpuKey[]
}

export const createSpuApi = (data: SpuModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/spu/create',
    data,
  })
}

export const updateSpuApi = (data: SpuModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/spu/update',
    data,
  })
}

export const deleteSpuApi = (id: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/spu/${id}`,
  })
}

export const getSpuApi = (id: number): APIResponseType<SpuModel> => {
  return $axios({
    method: 'get',
    url: `/v1/spu/${id}`,
  })
}

export const getSpuListApi = (data?: BasePageParams): APIResponseType<BaseListModel<SpuModel>> => {
  return $axios({
    method: 'get',
    url: `/v1/spu/list`,
    params: data,
  })
}
