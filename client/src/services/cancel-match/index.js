import apiClient from 'services/axios'
import { notification } from 'antd'

export async function LoadData(payload, source) {
  return apiClient
    .get(`/cancel-match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Update(payload, source) {
  return apiClient
    .put(`/cancel-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Cancel Match status has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadDataSpecial(payload, source) {
  return apiClient
    .get('/cancel-match/special', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateSpecial(payload, source) {
  return apiClient
    .put('/cancel-match/special', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Cancel Match Special has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateSpecialBasket(payload, source) {
  return apiClient
    .put('/cancel-match/special-basket', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Cancel Match Special has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export default LoadData
