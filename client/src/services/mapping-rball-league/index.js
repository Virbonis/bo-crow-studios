import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadTable(payload, source) {
  return apiClient
    .get('/mapping-rb/league', { params: payload, headers: { source } })
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
    .put(`/mapping-rb/league`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Mapping RBall League has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTable
