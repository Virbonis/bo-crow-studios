import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadData(payload, source) {
  return apiClient
    .get(`/unprocess-outright`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UnprocessOutright(payload, source) {
  return apiClient
    .post(`/unprocess-outright`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Unprocess Outright Has been Queued.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function CancelQueue(payload, source) {
  return apiClient
    .delete(`/unprocess-outright`, { params: payload, headers: { source } })
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
