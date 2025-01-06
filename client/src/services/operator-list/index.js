import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/operator-list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Create(payload, source) {
  return apiClient
    .post(`/operator-list`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Opeartor has been created.',
          })
          return true
        }
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Update(payload, source) {
  return apiClient
    .put(`/operator-list`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Opeartor has been updated.',
          })
          return true
        }
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
