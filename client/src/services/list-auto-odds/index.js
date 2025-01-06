import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/list-auto-odds', { params: payload, headers: { source } })
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
    .put('/list-auto-odds', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Match Auto Odds has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Delete(payload, source) {
  return apiClient
    .delete('/list-auto-odds', { data: payload, headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Match Auto Odds has been deleted.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
