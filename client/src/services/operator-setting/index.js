import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get(`/operator-setting`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateSetting(payload, source) {
  return apiClient
    .put(`/operator-setting`, payload, { headers: { source } })
    .then(response => {
      if (response.data.status === 0) {
        notification.info({
          message: 'Success Update Operator Setting',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export default Load
