import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/cancel-bet-list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadUser(payload, source) {
  return apiClient
    .get('/cancel-bet-list/user', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
