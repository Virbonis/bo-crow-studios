import apiClient from 'services/axios'

export async function LoadTable(payload, source) {
  return apiClient
    .get('/fund-transfer', { params: payload, headers: { source } })
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
    .get('/fund-transfer/detail', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTable
