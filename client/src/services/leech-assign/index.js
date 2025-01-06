import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadLeagueTable(payload, source) {
  return apiClient
    .get('/leech-assign/league', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadMatchTable(payload, source) {
  return apiClient
    .get('/leech-assign/match', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadPopupTable(payload, source) {
  return apiClient
    .get('/leech-assign/popup', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateLeague(payload, source) {
  return apiClient
    .put('/leech-assign/league', payload, source)
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Leech Assign League has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMatch(payload, source) {
  return apiClient
    .put('/leech-assign/match', payload, source)
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Leech Assign Match has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadLeagueTable
