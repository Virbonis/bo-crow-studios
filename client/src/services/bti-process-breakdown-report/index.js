import apiClient from 'services/axios'
import { notification } from 'antd'

export async function Process(payload, source) {
  return apiClient
    .post('/bti-process-breakdown-report', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Success Process',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Process
