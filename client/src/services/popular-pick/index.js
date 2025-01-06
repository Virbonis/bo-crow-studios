import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadCategory(source) {
  return apiClient
    .get('/popular-pick/category', { headers: { source } })
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
    .get('/popular-pick', { params: payload, headers: { source } })
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
    .post('/popular-pick', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Popular Pick has been inserted.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Delete(payload, source) {
  return apiClient
    .delete('/popular-pick', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Popular Pick has been deleted.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function DeleteFinished(payload, source) {
  return apiClient
    .delete('/popular-pick/finished', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Popular Pick has been cleared.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
