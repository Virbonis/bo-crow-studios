import { notification } from 'antd'
import apiClient from 'services/axios'

export async function UpdateScoreMatch(payload, source) {
  return apiClient
    .patch(`/mo5/scorematch`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Score Match has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function GetFinalScore(payload, source) {
  return apiClient
    .get(`/mo5/finalscore`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export default UpdateScoreMatch
