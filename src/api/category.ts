import $axios from '@/request'
import { APIResponseType, BaseListModel, BasePageParams } from './apiTypes'

export interface CategoryModel {
  id?: number
  name: string
  description: string
  isRoot?: number
  parentId?: number
  img: string
  index: number
  online: number
  level?: number
}

//获取一级category列表
export const getCategoryListApi = (data?: BasePageParams): APIResponseType<BaseListModel<CategoryModel>> => {
  return $axios({
    method: 'get',
    url: '/v1/category/root/list',
    params: data,
  })
}

//获取category详情
export const getCategoryDetailApi = (id: number): APIResponseType<CategoryModel> => {
  return $axios({
    method: 'get',
    url: `/v1/category/${id}`,
  })
}

//删除category
export const deleteCategoryApi = (id: number): APIResponseType<null> => {
  return $axios({
    method: 'delete',
    url: `/v1/category/${id}`,
  })
}

//修改category
export const updateCategoryApi = (data: CategoryModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/category/update',
    data,
  })
}

//创建category
export const createCategoryApi = (data: CategoryModel): APIResponseType<null> => {
  return $axios({
    method: 'post',
    url: '/v1/category/create',
    data,
  })
}
