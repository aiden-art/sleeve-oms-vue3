import $axios from '@/request'
import { APIResponseType } from './apiTypes'

export interface UploadResModel {
  filename: string
  url: string
}

//上传文件至OSS
export const uploadFileToOSS = (data: FormData): APIResponseType<UploadResModel> => {
  return $axios({
    method: 'post',
    url: '/v1/upload/oss',
    data,
  })
}
