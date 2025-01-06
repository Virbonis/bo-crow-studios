import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSelect(source) {
  return apiClient
    .get(`/branch/select`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Load(source) {
  return apiClient
    .get(`/branch`, { headers: { source } })
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
    .put(`/branch`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Branch has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateBranchLiveStream(payload, source) {
  return apiClient
    .put(`/branch/live-stream`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Branch Live Stream has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadBranchLimit(payload, source) {
  return apiClient
    .get(`/branch/limit`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateBranchLimit(payload, source) {
  return apiClient
    .put(`/branch/limit`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Branch Limit has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadBranchSportLimit(payload, source) {
  return apiClient
    .get(`/branch/sport-limit`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function DeleteBranchSportLimit(payload, source) {
  return apiClient
    .delete(`/branch/sport-limit`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Branch Sport Limit has been deleted.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateBranchSportLimit(payload, source) {
  return apiClient
    .put(`/branch/sport-limit`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Branch Sport Limit has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSelect
