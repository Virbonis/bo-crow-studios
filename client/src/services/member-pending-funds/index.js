import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/pending-funds', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadDailyStatement(payload, source) {
  return apiClient
    .get('/pending-funds/daily-statement', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadBetSummary(payload, source) {
  return apiClient
    .get('/pending-funds/bet-summary', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadBetList(payload, source) {
  return apiClient
    .get('/pending-funds/bet-list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadBetListRunning(payload, source) {
  return apiClient
    .get('/pending-funds/bet-list-running', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export default Load
