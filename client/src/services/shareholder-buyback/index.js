import { notification } from 'antd'
import apiClient from 'services/axios'

export async function Create(payload, source) {
  return apiClient
    .post(`/shareholder-buyback`, payload, { headers: { source } })
    .then(response => {
      if (response) {
        notification.info({
          message: 'Agent Buyback has been created.',
        })
        return true
      }
      return false
    })
    .catch(err => console.log(err))
}

export default Create
