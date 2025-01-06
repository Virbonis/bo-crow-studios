import { notification } from 'antd'
import apiClient from 'services/axios'
import { showErrorNotification } from 'services/mo5'

export async function GetMaxLine(payload, source) {
  return apiClient
    .get('/match/maxline', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function ListIBC(payload, source) {
  return apiClient
    .get('/match/autoaddsubmatch/ibc', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function ListGLive(payload, source) {
  return apiClient
    .get('/match/autoaddsubmatch/glive', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateAutoAddSubMatch(payload, source) {
  return apiClient
    .put(`/match/autoaddsubmatch`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Sync Market has been updated.',
        })
        return true
      }
      return false
    })
    .catch(showErrorNotification)
}
export async function UpdateAutoAddSubMatchSyncMarket(payload, source) {
  return apiClient
    .put(`/match/autoaddsubmatchsyncmarket`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Sync Market has been updated.',
        })
        return true
      }
      return false
    })
    .catch(showErrorNotification)
}
export async function UpdateAutoAddSubMatchSyncLeague(payload, source) {
  return apiClient
    .put(`/match/autoaddsubmatchsyncleague`, payload, { headers: { source } })
    .then(response => {
      if (response.data.status === 0) {
        notification.info({
          message: 'Sync League has been updated.',
        })
        return true
      }
      return response.data
    })
    .catch(showErrorNotification)
}

export default GetMaxLine
