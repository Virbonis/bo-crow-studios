import apiClient from 'services/axios'

export async function LoadBreakdownReportUT(payload, source) {
  return apiClient
    .get('/breakdown-winloss-user-team', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadBreakdownReportUT
