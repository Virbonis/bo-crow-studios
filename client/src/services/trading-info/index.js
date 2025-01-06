import { notification } from 'antd'
import apiClient from 'services/axios'

export async function GetMatchTradingInfo(payload, source) {
  return apiClient
    .get('/trading-info/match', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadTable(payload, source) {
  return apiClient
    .get('/trading-info', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Create(payload, source) {
  return apiClient
    .post(`/trading-info`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response) {
          notification.info({
            message: 'Trading Info has been created.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTable
