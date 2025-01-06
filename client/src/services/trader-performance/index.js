import apiClient from 'services/axios'

export async function LoadTrader(payload, source) {
  return apiClient
    .get('/trader-performance/trader', { params: payload, headers: { source } })
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
    .get('/trader-performance/league', { params: payload, headers: { source } })
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
    .get('/trader-performance', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTrader
