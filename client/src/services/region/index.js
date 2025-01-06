import apiClient from 'services/axios'
import { notification } from 'antd'

export async function LoadSelect(source) {
  return apiClient
    .get(`/region/select`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Load(source) {
  return apiClient
    .get(`/region`, { headers: { source } })
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
    .post(`/region`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Region has been created.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Update(payload, source) {
  return apiClient
    .put(`/region`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Region has been updated.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSelect
