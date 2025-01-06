import apiClient from 'services/axios'

export async function LoadExportBetEnquiry(payload, source) {
  return apiClient
    .get('/export/bet-enquiry', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadExportMatchList(payload, source) {
  return apiClient
    .get('/export/match-list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadExportBetEnquiry
