import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadData(payload, source) {
  return apiClient
    .get(`/league-duplicate-match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Search(payload, source) {
  return apiClient
    .get(`/league-duplicate-match/search`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Insert(payload, source) {
  return apiClient
    .post(`/league-duplicate-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.data.data_failed) {
          notification.warning({
            message: response.data.data.data_failed,
          })
        }
        if (response.data.data.is_success) {
          notification.info({
            message: 'League Duplicate Match has been created.',
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
    .delete(`/league-duplicate-match`, { data: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'League Duplicate Match has been deleted.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadData
