import apiClient from 'services/axios'

export async function LoadPayoutTracker(payload, source) {
  return apiClient
    .get(`/payout-tracker`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadPayoutTracker
