import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSummaryTraderDeadBallCopy(payload, source) {
  return apiClient
    .get(`/breakdown-patching`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.data.length === 0) {
          notification.warning({
            message: 'Deadball Breakdown Report For This Match ID is not Found !',
          })
        }
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateTraderDeadBallCopy(payload, source) {
  return apiClient
    .put(`/breakdown-patching`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success Copy Match!',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSummaryTraderDeadBallCopy
