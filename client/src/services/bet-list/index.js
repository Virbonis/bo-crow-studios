import apiClient from 'services/axios'

export async function LoadMatch(payload, source) {
  return apiClient
    .get('/betlist/detail', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function GetForecast(payload, source) {
  return apiClient
    .get('/betlist/forecast', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export default LoadMatch
