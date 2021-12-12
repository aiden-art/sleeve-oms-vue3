import $axios from '@/request'
import { method } from 'lodash'
import { APIResponseType, BaseListModel, BasePageParams } from './apiTypes'

export interface BannerModel {
  id?: number
  name: string
  title: string
  description: string
  img: string
  items?: BannerItemModel[]
}
export interface BannerItemModel {
  id?: number
  name: string
  img: string
  keyword: string
  type?: number
  bannerId?: number
}

export type BannerQueryType = {
  id?: number
  name?: string
  title?: string
}

//获取banner列表
export const getBannerListApi = (
  data?: BasePageParams & BannerQueryType
): APIResponseType<BaseListModel<BannerModel>> => {
  return $axios({
    method: 'get',
    url: '/v1/banner/list',
    params: data,
  })
}

//查询banner详情
export const getBannerDetailApi = (id: number): APIResponseType<BannerModel> => {
  return $axios({
    method: 'get',
    url: `/v1/banner/${id}`,
  })
}

//更新banner
export const editBannerApi = (data: BannerModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: `/v1/banner/update`,
    data,
  })
}

//删除banner
export const deleteBannerApi = (id: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/banner/${id}`,
  })
}

//创建banner
export const createBannerApi = (data: BannerModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: `/v1/banner/create`,
    data,
  })
}

//创建bannerItem
export const createBannerItemApi = (data: BannerItemModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/banner-item/create',
    data,
  })
}

//编辑BannerItem
export const editBannerItemApi = (data: BannerItemModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/banner-item/update',
    data,
  })
}

//删除BannerItem
export const deleteBannerItemApi = (id: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/banner-item/${id}`,
  })
}

//获取bannerItem详情
export const getBannerItemDetail = (id: number): APIResponseType<BannerItemModel> => {
  return $axios({
    method: 'get',
    url: `/v1/banner-item/${id}`,
  })
}
