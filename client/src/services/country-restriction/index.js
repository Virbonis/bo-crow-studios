import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/country-restriction', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadEditCountry(payload, source) {
  return apiClient
    .get('/country-restriction/edit', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateEditCountry(payload, source) {
  return apiClient
    .put('/country-restriction/edit', payload, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
