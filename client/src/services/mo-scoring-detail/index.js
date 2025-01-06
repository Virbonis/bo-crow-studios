import { notification } from 'antd'
import apiClient from 'services/axios'

export async function UpdateScoreDetail(payload, source) {
  return apiClient
    .patch(`/mo5/scoredetail`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Score Detail has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default UpdateScoreDetail
