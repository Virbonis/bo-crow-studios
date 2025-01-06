import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadTraders(payload, source) {
  return apiClient
    .get('/match-assignment/list-trader', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadCounterMyMatches(payload, source) {
  return apiClient
    .get('/match-assignment/my-matches/counter', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadCounterUserTeamMatches(payload, source) {
  return apiClient
    .get('/match-assignment/user-team-matches/counter', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMyMatches(payload, source) {
  return apiClient
    .get(`/match-assignment/my-matches`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadUserTeamMatches(payload, source) {
  return apiClient
    .get(`/match-assignment/user-team-matches`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLeague(payload, source) {
  return apiClient
    .get('/match-assignment/league', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLeagueRO(payload, source) {
  return apiClient
    .get('/match-assignment-ro/league', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateLeague(payload, source) {
  return apiClient
    .put('/match-assignment/league', payload, source)
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Match Assignment League has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMatch(payload, source) {
  return apiClient
    .get('/match-assignment/match', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadMatchPick(payload, source) {
  return apiClient
    .get('/match-assignment-pick/match', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

// for this function, use post instead of get
export async function LoadMatchRO(payload, source) {
  return apiClient
    .post('/match-assignment-ro/match', payload, { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMatch(payload, source) {
  return apiClient
    .put('/match-assignment/match', payload, source)
    .then(response => {
      if (response) {
        if (response.data.status === 0) {
          notification.info({
            message: 'Match Assignment has been updated.',
          })
          return true
        }
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateMatchPick(payload, source) {
  return apiClient
    .put(`/match-assignment-pick/match`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match Assignment Pick has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadDetail(payload, source) {
  return apiClient
    .get('/match-assignment/detail', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateDetail(payload, source) {
  return apiClient
    .put(`/match-assignment/detail`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Match Assignment has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadLog(payload, source) {
  return apiClient
    .get('/match-assignment/log', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadMyMatches
