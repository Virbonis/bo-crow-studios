import apiClient from 'services/axios'

export async function LoadSelect(source) {
  return apiClient
    .get('/general/odds-spread', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSelect