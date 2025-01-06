import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get('/edit-sub-match-setting', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Update(payload, source) {
  return apiClient
    .put('/edit-sub-match-setting', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Sub Match Setting has been Updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadOutrightSetting(payload, source) {
  return apiClient
    .get('/edit-sub-match-outright-setting', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateOutrightSetting(payload, source) {
  return apiClient
    .put(`/edit-sub-match-outright-setting`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Update Outright odds successful.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadSpecial(payload, source) {
  return apiClient
    .get('/edit-sub-match-special-setting', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateSpecial(payload, source) {
  return apiClient
    .put(`/edit-sub-match-special-setting`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Sub Match Setting Special has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
