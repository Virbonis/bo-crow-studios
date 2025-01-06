import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/user-login-session', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadPopUp(payload, source) {
  return apiClient
    .get('/user-login-session/pop-up', { params: payload, headers: { source } })
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
    .put('/user-login-session', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'User Login Session has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
