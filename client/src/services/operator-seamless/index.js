import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(source) {
  return apiClient
    .get('/operator-seamless', { headers: { source } })
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
    .post('/operator-seamless', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Success Create Operator Seamless',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadConfig(payload, source) {
  return apiClient
    .get(`/operator-seamless/${payload.operator_id}/config`, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function CreateConfig(payload, source) {
  return apiClient
    .post(`/operator-seamless/${payload.operator_id}/config`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Operator Config has been created.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateConfig(payload, source) {
  return apiClient
    .put(`/operator-seamless/${payload.operator_id}/config`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Operator Config has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function DeleteConfig(payload, source) {
  return apiClient
    .delete(`/operator-seamless/${payload.operator_id}/config`, {
      headers: { source },
      data: payload,
    })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Operator Config has been deleted.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
