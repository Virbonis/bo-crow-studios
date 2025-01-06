import apiClient from 'services/axios'
import { showNotification } from 'services/mo5'

export async function LoadMoreOE(payload, source) {
  return apiClient
    .get(`/mo5/more/${payload.match_id}/oe`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMoreWNW(payload, source) {
  return apiClient
    .get(`/mo5/more/${payload.match_id}/wnw`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMoreSpecial(payload, source) {
  return apiClient
    .get(`/mo5/more/${payload.match_id}/special`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMoreCS(payload, source) {
  return apiClient
    .get(`/mo5/more/${payload.match_id}/cs`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMoreBasketball(payload, source) {
  const { match_id, game_type } = payload
  return apiClient
    .get(`/mo5/more/${match_id}/basketball/${game_type}`, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMoreGameType(payload, source) {
  return apiClient
    .put(`/mo5/more/${payload.match_id}`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Sub match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMoreGameTypeBasketball(payload, source) {
  return apiClient
    .put(`/mo5/more/${payload.match_id}/basketball`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Sub match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMoreStatusBGAll(payload, source) {
  return apiClient
    .patch(`/mo5/more/${payload.match_id}/bg/all`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Status sub match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMoreStatusOpenAll(payload, source) {
  return apiClient
    .patch(`/mo5/more/${payload.match_id}/open/all`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Status sub match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMoreStatusPauseAll(payload, source) {
  return apiClient
    .patch(`/mo5/more/${payload.match_id}/pause/all`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Status sub match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMoreStatusBG(payload, source) {
  return apiClient
    .patch(`/mo5/more/${payload.match_id}/bg`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Status sub match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMoreStatusParlay(payload, source) {
  return apiClient
    .patch(`/mo5/more/${payload.match_id}/parlay`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Status sub match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMoreStatusOpen(payload, source) {
  return apiClient
    .patch(`/mo5/more/${payload.match_id}/open`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Status sub match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMoreStatusPause(payload, source) {
  return apiClient
    .patch(`/mo5/more/${payload.match_id}/pause`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Status sub match has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadMoreOE
