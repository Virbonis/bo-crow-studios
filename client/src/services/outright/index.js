import apiClient from 'services/axios'
import { notification } from 'antd'

export async function CreateOutright(payload, source) {
  return apiClient
    .post(`/outright`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Outright has been created.',
          })
          return true
        }
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadOutright(payload, source) {
  return apiClient
    .get(`/outright`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadOutrightTeam(payload, source) {
  return apiClient
    .get(`/outright/team`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function DeleteOutright(payload, source) {
  return apiClient
    .delete(`/outright`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Outright has been deleted.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadEditOutright(payload, source) {
  return apiClient
    .get(`/outright/edit`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateEditOutright(payload, source) {
  return apiClient
    .put(`/outright/edit`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Outright has been Updated.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadOutright
