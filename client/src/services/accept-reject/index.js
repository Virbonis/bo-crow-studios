import { notification } from 'antd'
import apiClient from 'services/axios'

export async function UpdateTicketMOByMatch(payload, source) {
  return apiClient
    .put(`/acceptreject/mo/${payload.match_id}`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Ticket has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateTicketMO(payload, source) {
  return apiClient
    .put(`/acceptreject/mo`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Ticket has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function UpdateTicketInstantBet(payload, source) {
  return apiClient
    .put(`/acceptreject/instantbet`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Ticket has been updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default UpdateTicketMO
