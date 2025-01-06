import apiClient from 'services/axios'
import { notification } from 'antd'

export async function LoadData(payload, source) {
  return apiClient
    .get('/match/autoaddmatch', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function AddData(payload, source) {
  return apiClient
    .post('/match/autoaddmatch', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success Add Match',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadData
