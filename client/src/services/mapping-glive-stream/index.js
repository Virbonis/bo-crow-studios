import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadLeague(payload, source) {
  return apiClient
    .get(`/mapping-gls/match/select/league`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueGL(payload, source) {
  return apiClient
    .get(`/mapping-gls/match/select/league-gl`, { params: payload, headers: { source } })
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
    .get(`/mapping-gls/match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMatchGL(payload, source) {
  return apiClient
    .get(`/mapping-gls/match-gl`, { params: payload, headers: { source } })
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
    .put(`/mapping-gls/match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Mapping GLiveStream has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadMatch
