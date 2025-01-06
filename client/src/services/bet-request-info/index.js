import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/bet-request-info', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
