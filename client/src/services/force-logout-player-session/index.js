import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Update(payload, source) {
  return apiClient
    .put('/force-logout-player-session', payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Force Logout Player Session has been updated',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Update
