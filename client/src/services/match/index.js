import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSelect(payload, source) {
  return apiClient
    .get('/match/select', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadSelectInBetList(payload, source) {
  return apiClient
    .get('/match/select/betlist', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadSelectInMO(payload, source) {
  return apiClient
    .get('/match/select/mo', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateSelect(payload, source) {
  return apiClient
    .put(`/match/select`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          // notification.info({
          //   message: 'Select match has been updated.',
          // })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Create(payload, source) {
  return apiClient
    .post(`/match/add-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Match has been created.',
          })
          return true
        }
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadMatchSequence(payload, source) {
  return apiClient
    .get('/match/sequence', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMatchSequence(payload, source) {
  return apiClient
    .put(`/match/sequence`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Match Sequence has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadSelectInInstantBet(payload, source) {
  return apiClient
    .get('/match/select/instantbet', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function SwapMatchSequence(payload, source) {
  return apiClient
    .put('/match/sequence/swap', payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Match Sequence has been Swap.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSelect
