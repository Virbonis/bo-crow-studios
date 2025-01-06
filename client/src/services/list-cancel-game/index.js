import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadCancelGame(payload, source) {
  return apiClient
    .get('/cancel-game', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function ResetCancelGame(payload, source) {
  const { update_type } = payload
  return apiClient
    .put(`/cancel-game`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: update_type === 0 ? 'Game Has Been Reset' : 'Game Has Been Ignored',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadCancelGame
