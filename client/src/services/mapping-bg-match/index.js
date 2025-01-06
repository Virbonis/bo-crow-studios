import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadLeague(payload, source) {
  return apiClient
    .get('/mapping-bg/match/select/league', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueBG(payload, source) {
  return apiClient
    .get('/mapping-bg/match/select/league-bg', { params: payload, headers: { source } })
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
    .get(`/mapping-bg/match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMatchBG(payload, source) {
  return apiClient
    .get('/mapping-bg/match-bg', { params: payload, headers: { source } })
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
    .put(`/mapping-bg/match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Mapping BG Match has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadBGGameEvent(payload, source) {
  return apiClient
    .get('/mapping-bg/game-event', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadMatch
