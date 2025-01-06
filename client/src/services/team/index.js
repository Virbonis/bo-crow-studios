import apiClient from 'services/axios'
import { notification } from 'antd'

export async function Load(payload, source) {
  return apiClient
    .get('/team', { params: payload, headers: { source } })
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
    .get('/team/detail', { params: payload, headers: { source } })
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
    .post('/team', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Team has been created.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateCountry(payload, source) {
  return apiClient
    .put('/team/country', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Country has been Updated.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Update(payload, source) {
  return apiClient
    .put('/team', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Team has been Updated.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function Delete(payload, source) {
  return apiClient
    .delete('/team', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Team has been Deleted.',
        })
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadTeamAddMatch(payload, source) {
  return apiClient
    .get('/team/select/add-match', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadTeamStandingsKnockout(payload, source) {
  return apiClient
    .get('/team/select/standingsknockout', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function LoadTeamAddOutright(payload, source) {
  return apiClient
    .get('/team/select/add-outright', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadTeamMappingTeam(payload, source) {
  return apiClient
    .get('/team/select/mapping-team', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadTeamMappingTeamRB(payload, source) {
  return apiClient
    .get('/team/select/mapping-team-rball', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
