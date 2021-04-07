import { AxiosResponse } from 'axios'
import _axios from '../../request'
import { BannerModel } from './model'
import { BaseListModel, BaseResponseModel } from '../baseModel'

class Banner {
  //获取banner列表
  async getBanners(data?: any): Promise<AxiosResponse<BaseListModel<BannerModel>>> {
    return _axios({
      method: 'get',
      url: '/v1/banner/page',
      params: data,
    })
  }

  //查询banner详情
  async getBannerDetail(id: number): Promise<AxiosResponse<BannerModel>> {
    return _axios({
      method: 'get',
      url: `/v1/banner/${id}`,
    })
  }

  //更新banner
  async editBanner(id: number, data: any): Promise<AxiosResponse<BaseResponseModel>> {
    return _axios({
      method: 'put',
      url: `/v1/banner/${id}`,
      data,
    })
  }

  //删除banner
  async deleteBanner(id: number): Promise<AxiosResponse<BaseResponseModel>> {
    return _axios({
      method: 'delete',
      url: `/v1/banner/${id}`,
    })
  }
}

export default new Banner()
