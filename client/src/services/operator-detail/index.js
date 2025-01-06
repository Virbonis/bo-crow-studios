import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(source) {
  return apiClient
    .get('/operator-detail', { headers: { source } })
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
    .put('/operator-detail', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Success update operator detail !',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
