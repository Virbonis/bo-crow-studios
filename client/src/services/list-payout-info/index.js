import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadPayoutInfo(payload, source) {
  return apiClient
    .get(`/list-payout-info`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateListPayoutInfo(payload, source) {
  return apiClient
    .put('/list-payout-info', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'List Payout has been updated',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadPayoutInfo
