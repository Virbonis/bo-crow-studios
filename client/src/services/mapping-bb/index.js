import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadTable(payload, source) {
  return apiClient
    .get('/mapping-bb', { params: payload, headers: { source } })
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
    .put('/mapping-bb', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Mapping BB has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTable
