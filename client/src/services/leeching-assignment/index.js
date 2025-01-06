import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSport(payload, source) {
  return apiClient
    .get(`/leeching-assignment/sport`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLeague(payload, source) {
  return apiClient
    .get(`/leeching-assignment/league`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateSport(payload, source) {
  return apiClient
    .put(`/leeching-assignment/sport`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Leeching Assignment Sport has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateLeague(payload, source) {
  return apiClient
    .put(`/leeching-assignment/league`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Leeching Assignment League has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSport
