import apiClient from 'services/axios'

export async function LoadTable(source) {
  return apiClient
    .get(`/settled-match-count`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTable
