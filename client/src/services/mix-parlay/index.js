import { notification } from 'antd'
import apiClient from 'services/axios'

export async function UpdateOnOffMatchParlay(payload, source) {
  return apiClient
    .put(`/mix-parlay/on-off-parlay-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'On/Off Match Parlay has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateOnOffSubMatchParlay(payload, source) {
  return apiClient
    .put(`/mix-parlay/on-off-parlay-sub-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'On/Off Sub Match Parlay has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default UpdateOnOffSubMatchParlay
