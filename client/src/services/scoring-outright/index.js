import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(payload, source) {
  return apiClient
    .get(`/scoring-outright`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function LoadTeam(payload, source) {
  return apiClient
    .get('/scoring-outright/team', { params: payload, headers: { source } })
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
    .put('/scoring-outright/team', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Scoring Outright has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Delete(payload, source) {
  return apiClient
    .delete('/scoring-outright/team', { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Scoring Outright has been deleted.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
