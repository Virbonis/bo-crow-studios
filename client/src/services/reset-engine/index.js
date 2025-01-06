import { notification } from 'antd'
import apiClient from 'services/axios'

export async function ResetEngine(source) {
  return apiClient
    .post(`/reset-engine`, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Reset is success !',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default ResetEngine
