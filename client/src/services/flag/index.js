import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSelect(payload, source) {
  return apiClient
    .get('/flag/select', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadFlag(payload, source) {
  return apiClient
    .get('/flag', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function AddFlag(payload, source) {
  return apiClient
    .post('/flag', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Success Insert Flag',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateFlag(payload, source) {
  return apiClient
    .put('/flag', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Success Update Flag',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSelect
