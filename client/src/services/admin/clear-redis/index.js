import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(source) {
  return apiClient
    .get('/clear-redis', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function ClearRedis(payload, source) {
  return apiClient
    .post('/clear-redis', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Clear Redis executed successfully',
          })
          return response.data.data
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
