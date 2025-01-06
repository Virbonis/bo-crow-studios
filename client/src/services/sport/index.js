import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSelect(source) {
  return apiClient
    .get('/sport/select', { headers: { source } })
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
    .get('/sport', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadSorting(payload, source) {
  return apiClient
    .get('/sport/sorting', { params: payload, headers: { source } })
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
    .put(`/sport`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Data has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateSorting(payload, source) {
  return apiClient
    .put(`/sport/sorting`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Data has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function CopySorting(payload, source) {
  return apiClient
    .post(`/sport/sorting`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Data has been copied.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadDelayBet(payload, source) {
  return apiClient
    .get('/sport/delay-bet', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
