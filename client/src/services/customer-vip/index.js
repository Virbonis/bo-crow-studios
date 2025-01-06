import apiClient from 'services/axios'

export async function LoadData(payload, source) {
  return apiClient
    .get('/customer-vip', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadDataCompliance(payload, source) {
  return apiClient
    .get('/customer-vip-compliance', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadData
