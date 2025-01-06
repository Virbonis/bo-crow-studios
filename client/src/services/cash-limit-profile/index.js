import apiClient from 'services/axios'
import { notification } from 'antd'

export async function Load(payload, source) {
  return apiClient
    .get(`/cash-limit-profile`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Delete(payload, source) {
  return apiClient
    .delete(`/cash-limit-profile`, {
      data: payload,
      headers: { source },
    })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Cash Limit Profile has been deleted.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Create(payload, source) {
  return apiClient
    .post(`/cash-limit-profile`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Cash Limit Profile has been created.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLog(payload, source) {
  return apiClient
    .get(`/cash-limit-profile/log`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadDetail(payload, source) {
  return apiClient
    .get(`/cash-limit-profile/detail`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function DeleteDetail(payload, source) {
  return apiClient
    .delete(`/cash-limit-profile/detail`, {
      data: payload,
      headers: { source },
    })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Cash Limit has been deleted.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function CreateDetail(payload, source) {
  return apiClient
    .post(`/cash-limit-profile/detail`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Cash Limit has been created.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateDetail(payload, source) {
  return apiClient
    .put(`/cash-limit-profile/detail`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0 && payload.jumlah_league === 1) {
          notification.info({
            message: 'Success update cash limit profile detail !',
          })
        } else {
          notification.info({
            message:
              'Success update cash limit profile detail ! *You have other groups. Please check out other groups !',
          })
        }
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
