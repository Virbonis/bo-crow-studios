import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadData(payload, source) {
  return apiClient
    .get(`/league-hidden`, { params: payload, headers: { source } })
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
    .post(`/league-hidden`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.data.data_failed) {
          notification.warning({
            message: response.data.data.data_failed,
          })
        }
        if (response.data.data.is_success) {
          notification.info({
            message: 'League Hidden has been created.',
          })
        }
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Delete(payload, source) {
  return apiClient
    .delete(`/league-hidden`, { data: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'League Hidden has been deleted.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadData
