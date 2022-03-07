import axios from 'axios'

//环境变量
const mode = import.meta.env.MODE
//接口地址
const prodBaseURL = import.meta.env.VITE_BASE_URL as string
const $axios = axios.create({
  baseURL: mode === 'production' ? prodBaseURL : '/',
  timeout: 50 * 1000,
})

$axios.interceptors.request.use((config) => {
  return config
})

$axios.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default $axios
