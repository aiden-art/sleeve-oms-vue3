import axios from 'axios'

const $axios = axios.create({
  baseURL: '/',
  timeout: 5 * 1000,
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
