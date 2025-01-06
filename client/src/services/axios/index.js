import axios from 'axios'
import store from 'store'
import { notification } from 'antd'

const apiClient = axios.create({
  baseURL: '/api/v1beta1/',
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
})

apiClient.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
    request.headers.AccessToken = accessToken
  }
  return request
})

apiClient.interceptors.response.use(undefined, error => {
  // Errors handling
  const { response } = error
  const { data, status } = response

  if (status === 401) {
    // store.remove('accessToken')
    // history.push('/auth/login')
  } else if (status === 502) {
    notification.warning({
      message: 'Internal Server Error',
    })
  }
  if (data && !response.config.url.includes('/select' || 'auth/menu')) {
    notification.warning({
      style: {
        whiteSpace: 'pre-wrap',
      },
      message: data.replaceAll('|', '\n'),
    })
  }
  return Promise.reject(error)
})

export default apiClient
