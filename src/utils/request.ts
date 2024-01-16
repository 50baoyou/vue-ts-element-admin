import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// 使用自定义配置创建 axios 实例
const service = axios.create({
  // url = base url + request url
  baseURL: import.meta.env.VITE_APP_API,
  // 如果请求时间超过 `timeout（单位：毫秒）` 的值，则请求会被中断
  timeout: 5000,
  // 设置请求体为 UTF-8 编码的 JSON 格式
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 注册请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 注册响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    const { code, msg } = response.data

    if (code <= 200) {
      console.log(msg)
      return response.data
    }
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数

    return Promise.reject(error)
  }
)

export default service
