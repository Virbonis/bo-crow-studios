import apiClient from 'services/axios'

export function LoadTable(payload, source) {
  return apiClient
    .get('/sb-platform-summary', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTable
