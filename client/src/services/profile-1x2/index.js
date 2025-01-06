import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSelect(source) {
  return apiClient
    .get('/profile1x2/select', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadHDPList(source) {
  return apiClient
    .get('/profile1x2/hdp', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadData(payload, source) {
  return apiClient
    .get(`/profile1x2`, { params: payload, headers: { source } })
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
    .put(`/profile1x2/${payload.limit_id_1x2}`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Profile has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Create(payload, source) {
  return apiClient
    .post('/profile1x2', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Profile has been created.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSelect
