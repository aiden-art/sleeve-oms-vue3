import { AxiosPromise, AxiosResponse } from 'axios'
import _axios from '../../request'
import { BannerModel } from './model'
import { BaseListModel } from '../baseModel'

class Banner {
  //获取banner列表
  async getBanners(data?: any): Promise<AxiosResponse<BaseListModel<BannerModel>>> {
    return _axios({
      method: 'get',
      url: '/v1/banner/page',
      params: data,
    })
  }
}

export default new Banner()
