import apiClient from 'services/axios'

export async function LoadListParlay(payload, source) {
  return apiClient
    .get('/instantbet/parlay', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadListMatchParlay(payload, source) {
  return apiClient
    .get('/instantbet/matchparlay', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadListLottery(payload, source) {
  return apiClient
    .get('/instantbet/lottery', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadListParlay
