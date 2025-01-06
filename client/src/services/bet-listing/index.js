import apiClient from 'services/axios'

export async function LoadTable(payload, source) {
  return apiClient
    .get('/bet-listing', { params: payload, headers: { source } })
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
    .get('/bet-listing/league', { params: payload, headers: { source } })
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
    .get(`/bet-listing/match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTable
