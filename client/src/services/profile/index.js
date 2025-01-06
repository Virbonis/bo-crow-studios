import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSelect(source) {
  return apiClient
    .get('/profile/select', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadData(payload, source) {
  return apiClient
    .get(`/profile`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Create(payload, source) {
  return apiClient
    .post(`/profile`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Profile has been created.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Update(payload, source) {
  return apiClient
    .put(`/profile/${payload.profile_id}`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Profile has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdatePayout(payload, source) {
  return apiClient
    .put(`/profile/${payload.league_profile}/payout`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Payout has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdatePayoutSpec(payload, source) {
  return apiClient
    .put(`/profile/${payload.league_profile}/payout-spec`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Payout Spec has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Delete(payload, source) {
  return apiClient
    .delete(`/profile/${payload.profile_id}`, { headers: { source } })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Profile has been deleted.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadOddsTrigger(payload, source) {
  return apiClient
    .get(`/profile/${payload.profile_id}/odds-trigger/${payload.game_type}`, {
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

export async function AddOddsTrigger(payload, source) {
  return apiClient
    .post(`/profile/${payload.profile_id}/odds-trigger/${payload.game_type}`, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Payout Spec has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateOddsTrigger(payload, source) {
  return apiClient
    .put(`/profile/${payload.limit_id}/odds-trigger/${payload.game_type}`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Odds Trigger has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function DeleteOddsTrigger(payload, source) {
  return apiClient
    .delete(`/profile/${payload.profile_id}/odds-trigger/${payload.game_type}`, payload, {
      headers: { source },
    })
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Odds Trigger has been deleted.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSelect
