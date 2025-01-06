import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadCancelOutright(payload, source) {
  return apiClient
    .get('/cancel-outright', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadCancelOutrightTeam(payload, source) {
  return apiClient
    .get('/cancel-outright/team', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateCancelOutright(payload, source) {
  return apiClient
    .put('/cancel-outright', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Outright has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadCancelOutright
