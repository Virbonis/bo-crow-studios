import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get(`/mapping-lottery`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function CopyToLottery(payload, source) {
  return apiClient
    .post(`/mapping-lottery`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Mapping to Lottery complete',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
