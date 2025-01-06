import apiClient from 'services/axios'
import { notification } from 'antd'

export async function LoadMatchLiveStream(payload, source) {
  return apiClient
    .get('/match-live-stream', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMatchLiveStream(payload, source) {
  return apiClient
    .put('/match-live-stream', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Match Live Stream has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadMatchLiveStream
