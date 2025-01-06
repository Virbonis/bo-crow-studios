import apiClient from 'services/axios'
import { notification } from 'antd'

export async function Load(payload, source) {
  return apiClient
    .get(`/scoring-match`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateHomeAwayPosisi(payload, source) {
  return apiClient
    .put(`/scoring-match/home-away`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Score has been updated',
        })
        if (response.data.data) {
          notification.warning({
            duration: 0,
            message: 'Please Check This Bet IDs',
            description: response.data.data, // data=betIDs (string)
          })
        }
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateScoringMatch(payload, source) {
  return apiClient
    .put(`/scoring-match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Score has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateScoringResetMatch(payload, source) {
  return apiClient
    .put(`/scoring-match/reset`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadSpecial(payload, source) {
  return apiClient
    .get(`/scoring-match/special`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateScoringMatchSpecial(payload, source) {
  return apiClient
    .put(`/scoring-match/special`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Score has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadScoringDetailMatch(payload, source) {
  return apiClient
    .get(`/scoring-match/detail`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateScoringDetail(payload, source) {
  return apiClient
    .put(`/scoring-match/detail`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Score has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function DeleteScoringDetail(payload, source) {
  return apiClient
    .delete(`/scoring-match/detail`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Score has been deleted.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadSpecialBasket(payload, source) {
  return apiClient
    .get(`/scoring-match/special-basket`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateScoringMatchSpecialBasket(payload, source) {
  return apiClient
    .put(`/scoring-match/special-basket`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Score has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateScoringMatchSpecialMainRound(payload, source) {
  return apiClient
    .put(`/scoring-match/special-basket/main-round`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Score has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
