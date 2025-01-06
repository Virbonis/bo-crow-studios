import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadSelect() {
  return apiClient
    .get(`/user-team/select`)
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadUserTeam(payload, source) {
  return apiClient
    .get(`/user-team`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function AddUserTeam(payload, source) {
  return apiClient
    .post(`/user-team`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Success Add User Team.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateUserTeam(payload, source) {
  return apiClient
    .put('/user-team', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'User Team has been Updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function DeleteUserTeam(payload, source) {
  return apiClient
    .delete(`/user-team`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Success Delete User Team.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadUserTeamSub(payload, source) {
  return apiClient
    .get(`/user-team/team-sub`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function AddUserTeamSub(payload, source) {
  return apiClient
    .post(`/user-team/team-sub`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Success Add User Team Sub.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateUserTeamSub(payload, source) {
  return apiClient
    .put('/user-team/team-sub', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'User Team Sub has been Updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function DeleteUserTeamSub(payload, source) {
  return apiClient
    .delete(`/user-team/team-sub`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Success Delete User Team Sub.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadMappingUser(payload, source) {
  return apiClient
    .get(`/user-team/user`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMappingUser(payload, source) {
  return apiClient
    .put('/user-team/user', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: `User Team's User has been Updated.`,
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadMappingUserSub(payload, source) {
  return apiClient
    .get(`/user-team/team-sub/user`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateMappingUserSub(payload, source) {
  return apiClient
    .put('/user-team/team-sub/user', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: `User Team's User has been Updated.`,
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadLeague(payload, source) {
  return apiClient
    .get(`/user-team/team-sub/league`, { params: payload, headers: { source } })
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
    .put(`/user-team/team-sub/league`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: `User Team's League has been Updated.`,
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadSelect
