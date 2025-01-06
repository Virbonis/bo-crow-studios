import Axios from 'axios'
import apiClient from 'services/axios'
import { showNotification } from 'services/mo5'

export async function UpdateGoal(payload, source) {
  return apiClient
    .patch(`/mo5/goal`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Match Goal has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdateCard(payload, source) {
  return Axios.all([
    apiClient.patch(`/mo5/yellowcard`, payload, { headers: { source } }),
    apiClient.patch(`/mo5/redcard`, payload, { headers: { source } }),
  ])
    .then(response => {
      if (response) {
        showNotification('Match Card has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdatePenalty(payload, source) {
  return apiClient
    .patch(`/mo5/penalty`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        showNotification('Match Penalty has been updated.')
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default UpdateGoal
