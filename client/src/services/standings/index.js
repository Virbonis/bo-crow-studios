import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadCategory(source) {
  return apiClient
    .get('/standings/category', { headers: { source } })
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
    .get('/standings', { params: payload, headers: { source } })
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
    .post('/standings', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Standings has been created.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Update(payload, source) {
  return apiClient
    .put('/standings', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Standings has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Delete(payload, source) {
  return apiClient
    .delete('/standings', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Standings has been deleted',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export default LoadCategory
