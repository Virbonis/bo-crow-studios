import apiClient from 'services/axios'
import { notification } from 'antd'

export async function resetFTHTScore(payload, source) {
  return apiClient
    .put('/mo-bet-list-summary', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          if (payload.process_type === 1) {
            notification.info({
              message: 'HT Score has been reset.',
            })
          } else if (payload.process_type === 2) {
            notification.info({
              message: 'FT Score has been reset.',
            })
          }
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function getBetListSummary(payload, source) {
  return apiClient
    .get('/mo-bet-list-summary', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default resetFTHTScore
