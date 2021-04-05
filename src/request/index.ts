import axios from 'axios'

const _axios = axios.create({
  baseURL: '/',
  timeout: 5 * 1000,
})

_axios.interceptors.request.use((config) => {
  return config
})

_axios.interceptors.response.use(
  (res) => {
    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default _axios
