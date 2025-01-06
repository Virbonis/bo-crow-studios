import apiClient from 'services/axios'
import { notification } from 'antd'

export async function Load(payload, source) {
  return apiClient
    .get('/match-profile', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function SelectInMatchProfile(payload, source) {
  return apiClient
    .get('/match-profile/league', { params: payload, headers: { source } })
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
    .put('/match-profile', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match Profile has been Updated.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
