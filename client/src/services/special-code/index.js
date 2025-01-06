import apiClient from 'services/axios'

export async function LoadSelect(source) {
  return apiClient
    .get('/special-code/select', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadBySport(payload, source) {
  return apiClient
    .get('/special-code/selectbysport', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSelect
