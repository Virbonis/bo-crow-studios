import { notification } from 'antd'
import apiClient from 'services/axios'

export async function LoadAcceptRejectedTicket(payload, source) {
  return apiClient
    .get(`/accept-rejected-ticket`, { params: payload, headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}

export async function UpdAcceptRejectedTicket(payload, source) {
  return apiClient
    .put(`/accept-rejected-ticket`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Success Update Accept Rejected Ticket',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default LoadAcceptRejectedTicket
