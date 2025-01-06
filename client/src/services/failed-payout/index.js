import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Load(source) {
  return apiClient
    .get('/failed-payout', { headers: { source } })
    .then(response => {
      if (response) {
        return response.data
      }
      return false
    })
    .catch(err => console.log(err))
}
export async function Reset(payload, source) {
  return apiClient
    .put('/failed-payout', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Payout has been Updated.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Load
