import apiClient from 'services/axios'

export async function LoadBreakdownReport(payload, source) {
  return apiClient
    .get(`/breakdown-winloss`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadBetDetail(payload, source) {
  return apiClient
    .get(`/breakdown-winloss/bet-detail`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadExportDate(payload, source) {
  return apiClient
    .get(`/breakdown-winloss/date-export`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadBreakdownReport
