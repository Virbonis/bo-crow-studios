import apiClient from 'services/axios'
import { notification } from 'antd'

export async function LoadUnprocessMatch(payload, source) {
  return apiClient
    .get(`/unprocess-match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UnprocessMatch(payload, source) {
  return apiClient
    .post('/unprocess-match', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Unprocess Match Has been Queued.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function DeleteQueueUnprocessMatch(payload, source) {
  return apiClient
    .delete(`/unprocess-match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Queue Unprocess Has been Deleted.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadUnprocessMatchSpecial(payload, source) {
  return apiClient
    .get(`/unprocess-match/special`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UnprocessMatchSpecial(payload, source) {
  return apiClient
    .post('/unprocess-match/special', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Special Match Has been Unprocessed.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadUnprocessMatch
