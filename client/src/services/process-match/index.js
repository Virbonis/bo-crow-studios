import apiClient from 'services/axios'
import { notification } from 'antd'

export async function LoadProcessMatch(payload, source) {
  return apiClient
    .get(`/process-match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ProcessMatch(payload, source) {
  return apiClient
    .post('/process-match', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Process Match Has been Queued.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function DeleteQueueProcessMatch(payload, source) {
  return apiClient
    .delete(`/process-match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Queue Process Has been Deleted.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadProcessMatchSpecial(payload, source) {
  return apiClient
    .get(`/process-match/special`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ProcessMatchSpecial(payload, source) {
  return apiClient
    .post('/process-match/special', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Special Match Has been Processed.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadProcessMatch
