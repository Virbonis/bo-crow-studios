import apiClient from 'services/axios'

export async function LoadTable(payload, source) {
  return apiClient
    .get('/member-duplicate-ip', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadTable
