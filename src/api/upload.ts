import $axios from '@/request'
import { APIResponseType } from './apiTypes'

export interface UploadResModel {
  filename: string
  url: string
}

//上传文件至OSS
export const uploadFileToOSS = (data: any): APIResponseType<UploadResModel> => {
  return $axios({
    method: 'post',
    url: '/upload/oss',
    data,
  })
}
