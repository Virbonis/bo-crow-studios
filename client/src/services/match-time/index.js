import { notification } from 'antd'
import apiClient from 'services/axios'
import { showErrorNotification } from 'services/mo5'

export async function Load(payload, source) {
  return apiClient
    .get('/mo5/autocloseautotimer', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateAutoClose(payload, source) {
  return apiClient
    .patch(`/mo5/autoclose`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Auto Close has been updated.',
        })
        return true
      }
      return false
    })
    .catch(showErrorNotification)
}

export async function UpdateAutoTimer(payload, source) {
  return apiClient
    .patch(`/mo5/autotimer`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Speedy Timer has been updated.',
        })
        return true
      }
      return false
    })
    .catch(showErrorNotification)
}

export async function UpdateMatchTime(payload, source) {
  return apiClient
    .put(`/mo5/matchtime`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match Time has been updated.',
        })
        return true
      }
      return false
    })
    .catch(showErrorNotification)
}

export default Load
