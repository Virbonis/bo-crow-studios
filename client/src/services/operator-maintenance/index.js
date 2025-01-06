import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(source) {
  return apiClient
    .get(`/operator-maintenance`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Update(payload, source) {
  return apiClient
    .put(`/operator-maintenance`, payload, { headers: { source } })
    .then(response => {
      if (response.data.status === 0) {
        notification.info({
          message: 'Success Update Operator Maintenance',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
