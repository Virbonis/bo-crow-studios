import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/mo5/baskettimer', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateBasketTimer(payload, source) {
  return apiClient
    .patch(`/mo5/baskettimer`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Basket Timer has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateAdjustBasketTimer(payload, source) {
  return apiClient
    .put(`/mo5/adjustbaskettimer`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Basket Timer has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
