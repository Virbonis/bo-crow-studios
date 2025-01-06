import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/online-list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadDetail(payload, source) {
  return apiClient
    .get('/online-list/detail', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function BetDetail(payload, source) {
  return apiClient
    .get('/online-list/bet-detail', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
