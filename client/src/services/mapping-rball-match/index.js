import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadLeague(payload, source) {
  return apiClient
    .get('/mapping-rb/match/select/league', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueRB(payload, source) {
  return apiClient
    .get('/mapping-rb/match/select/league-rb', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadMatch(payload, source) {
  return apiClient
    .get(`/mapping-rb/match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMatchRB(payload, source) {
  return apiClient
    .get('/mapping-rb/match-rb', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMapping(payload, source) {
  return apiClient
    .put(`/mapping-rb/match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Mapping RBall Match has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadMatch
