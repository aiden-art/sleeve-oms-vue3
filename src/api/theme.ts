import $axios from '@/request'
import { APIResponseType, BaseListModel, BasePageParams } from './apiTypes'
import { SpuModel } from './spu'

export interface ThemeModel {
  id?: number
  title: string
  description: string
  name: string
  tplName: string
  entranceName: string
  extend: string
  internalTopImg: string
  titleImg: string
  online: number
  spus: ThemeModel[]
}

export const createThemeApi = (data: ThemeModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/theme/create',
    data,
  })
}

export const updateThemeApi = (data: ThemeModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/theme/update',
    data,
  })
}

export const deleteThemeApi = (id: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/theme/${id}`,
  })
}

export const getThemeApi = (id: number): APIResponseType<ThemeModel> => {
  return $axios({
    method: 'get',
    url: `/v1/theme/${id}`,
  })
}

export const getThemeListApi = (data?: BasePageParams): APIResponseType<BaseListModel<ThemeModel>> => {
  return $axios({
    method: 'get',
    url: `/v1/theme/list`,
    params: data,
  })
}

export const addThemeSpuApi = (themeId: number, spuId: number): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: `/v1/theme/spu/${themeId}/${spuId}`,
  })
}

export const getThemeSpuListApi = (themeId: number): APIResponseType<SpuModel[]> => {
  return $axios({
    method: 'post',
    url: `/v1/theme/${themeId}/spu/list`,
  })
}

export const deleteThemeSpuApi = (themeId: number, spuId: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/theme/spu/${themeId}/${spuId}`,
  })
}
