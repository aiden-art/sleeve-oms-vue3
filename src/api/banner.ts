import $axios from '@/request'
import { APIResponseType, BaseListModel, BasePageParams } from './apiTypes'

export interface BannerModel {
  id: number
  name: string
  title: string
  description: string
  img: string
  items?: BannerItemModel[]
}
export interface BannerItemModel {
  id: number
  name: string
  img: string
  keyword: string
  type: number
  bannerId: number
}

//获取banner列表
export const getBannerListApi = (data?: BasePageParams): APIResponseType<BaseListModel<BannerModel>> => {
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
