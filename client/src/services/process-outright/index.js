import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadData(payload, source) {
  return apiClient
    .get(`/process-outright`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function ProcessOutright(payload, source) {
  return apiClient
    .post(`/process-outright`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Process Outright Has been Queued.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function CancelQueue(payload, source) {
  return apiClient
    .delete(`/process-outright`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Queue Process Has been Deleted.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadData
