import { notification } from 'antd'
import apiClient from 'services/axios'

export async function ResetService(source) {
  return apiClient
    .post('/bbz/reset-service', { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Reset is success !',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadChannelMonitoring(payload, source) {
  return apiClient
    .get('/bbz/channel-monitoring', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMatchList(payload, source) {
  return apiClient
    .get('/bbz/match-list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadActionLog(payload, source) {
  return apiClient
    .get('/bbz/action-log', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMarket(payload, source) {
  return apiClient
    .get('/bbz/market', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMarketLog(payload, source) {
  return apiClient
    .get('/bbz/market-log', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadIncident(payload, source) {
  return apiClient
    .get('/bbz/incident', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadMatchList
