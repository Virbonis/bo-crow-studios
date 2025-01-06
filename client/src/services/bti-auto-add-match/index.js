import apiClient from 'services/axios'
import { notification } from 'antd'

export async function LoadSelectLeague(payload, source) {
  return apiClient
    .get('/bti-auto-add-match/league/select', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMatchBTI(payload, source) {
  return apiClient
    .get('/bti-auto-add-match', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function InsertMatchBTI(payload, source) {
  return apiClient
    .put('/bti-auto-add-match', payload, { headers: { source } })
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

export default LoadMatchBTI
