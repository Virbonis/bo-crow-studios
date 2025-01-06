import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadCategory(source) {
  return apiClient
    .get('/knockouts/category', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Load(payload, source) {
  return apiClient
    .get('/knockouts', { params: payload, headers: { source } })
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
    .post('/knockouts', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Knockout has been created.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Update(payload, source) {
  return apiClient
    .put('/knockouts', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Knockout has been Updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Delete(payload, source) {
  return apiClient
    .delete('/knockouts', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Knockout has been deleted.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
