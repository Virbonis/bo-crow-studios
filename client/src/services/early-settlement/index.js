import { notification } from 'antd'
import apiClient from 'services/axios'
import { showErrorNotification } from 'services/mo5'

export async function Load(payload, source) {
  return apiClient
    .get('/mo5/earlysettlement', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(showErrorNotification)
}

export async function Update(payload, source) {
  return apiClient
    .put('/mo5/earlysettlement', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Early Settlement has been updated.',
        })
        return true
      }
      return false
    })
    .catch(showErrorNotification)
}

export default Load
