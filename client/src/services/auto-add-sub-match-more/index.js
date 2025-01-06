import { notification } from 'antd'
import apiClient from 'services/axios'

export async function GetStatusSubMatchMore(payload, source) {
  return apiClient
    .get('/match/autoaddsubmatchmore/status', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function RequestSubMatchMore(payload, source) {
  return apiClient
    .patch(`/match/autoaddsubmatchmore/request`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match More has been requested.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ResetSubMatchMore(payload, source) {
  return apiClient
    .patch(`/match/autoaddsubmatchmore/reset`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match More has been reset.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function ListSubMatchMore(payload, source) {
  return apiClient
    .get('/match/autoaddsubmatchmore', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateSubMatchMore(payload, source) {
  return apiClient
    .put(`/match/autoaddsubmatchmore`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match More has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default GetStatusSubMatchMore
