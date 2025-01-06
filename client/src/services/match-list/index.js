import apiClient from 'services/axios'
import { notification } from 'antd'

export async function LoadData(payload, source) {
  return apiClient
    .get('/match-list', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Get(payload, source) {
  return apiClient
    .get('/match-list/edit', { params: payload, headers: { source } })
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
    .put('/match-list/edit', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match List has been Updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Delete(payload, source) {
  return apiClient
    .delete('/match-list', { data: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match List has been Deleted',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadMatchInfo(payload, source) {
  return apiClient
    .get('/match-list/info', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMatchInfo(payload, source) {
  return apiClient
    .put('/match-list/info', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Info Match List has been Updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadListSubMatch(payload, source) {
  return apiClient
    .get('/match-list/submatch', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadDetailSpecial(payload, source) {
  return apiClient
    .get('/match-list/detail-special', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function DeleteDetailSpecial(payload, source) {
  return apiClient
    .delete('/match-list/detail-special', { data: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Special Match has been Deleted',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadMatchSpecial(payload, source) {
  return apiClient
    .get('/match-list/special', {
      params: payload,
      headers: { source },
    })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMatchSpecial(payload, source) {
  return apiClient
    .put('/match-list/special', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Update Special Match on Queue',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadMatchSpecialMore(payload, source) {
  return apiClient
    .get('/match-list/special/more', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMatchSpecialMore(payload, source) {
  return apiClient
    .put('/match-list/special/more', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Special Match has been Updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadData
