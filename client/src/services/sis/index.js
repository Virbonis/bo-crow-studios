import apiClient from 'services/axios'

export async function LoadActionLog(payload, source) {
  return apiClient
    .get(`/sis-action-log`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMarket(payload, source) {
  return apiClient
    .get(`/sis-market`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMarketLog(payload, source) {
  return apiClient
    .get(`/sis-market-log`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMatchList(payload, source) {
  return apiClient
    .get(`/sis-match-list`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export default LoadActionLog
