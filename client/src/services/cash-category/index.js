import apiClient from 'services/axios'
import { notification } from 'antd'

export async function Load(source) {
  return apiClient
    .get(`/cashcategory`, { headers: { source } })
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
    .put(`/cashcategory`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Data has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export default Load
